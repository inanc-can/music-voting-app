import { NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/deeplink"

export async function POST(req: NextRequest) {
  try {
    const { partyId, token } = await req.json()
    if (!partyId || !token) {
      return NextResponse.json({ error: "partyId and token are required" }, { status: 400 })
    }

    const payload = await verifyToken(token)
    if (!payload || payload.partyId !== String(partyId)) {
      return NextResponse.json({ error: "Invalid or expired link" }, { status: 400 })
    }

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Ensure session (anonymous if necessary)
    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData?.session) {
      const { data: anonData, error: anonErr } = await supabase.auth.signInAnonymously()
      if (anonErr || !anonData?.user) {
        return NextResponse.json({ error: "Failed to establish session" }, { status: 500 })
      }
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No user session" }, { status: 401 })
    }

    // Verify party exists and is active (best-effort: active if not explicitly ended)
    const { data: party, error: partyErr } = await supabase
      .from("parties")
      .select("*")
      .eq("id", partyId)
      .maybeSingle()

    if (partyErr || !party) {
      return NextResponse.json({ error: "Party not found" }, { status: 404 })
    }

    const isEnded = (party as any).ended_at != null
    const isExplicitlyInactive = (party as any).is_active === false
    if (isEnded || isExplicitlyInactive) {
      return NextResponse.json({ error: "This party has ended" }, { status: 410 })
    }

    // Join participant if not already joined
    const { data: existing, error: existingErr } = await supabase
      .from("partyparticipants")
      .select("id")
      .eq("party_id", partyId)
      .eq("user_id", user.id)
      .maybeSingle()

    if (!existing && !existingErr) {
      const { error: insertErr } = await supabase
        .from("partyparticipants")
        .insert({ party_id: partyId, user_id: user.id })
      if (insertErr) {
        return NextResponse.json({ error: "Failed to join party" }, { status: 500 })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to process link" }, { status: 500 })
  }
} 