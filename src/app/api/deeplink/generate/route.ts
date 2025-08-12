import { NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { randomUUID } from "crypto"
import QRCode from "qrcode"
import { buildDeepLinkUrl, signPayload } from "@/lib/deeplink"

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const partyId = url.searchParams.get("partyId")
    const ttlSec = Number(url.searchParams.get("ttl")) || 600 // default 10 min

    if (!partyId) {
      return NextResponse.json({ error: "partyId is required" }, { status: 400 })
    }

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Ensure the requester owns the party
    const { data: party, error } = await supabase
      .from("parties")
      .select("id, user_id")
      .eq("id", partyId)
      .single()

    if (error || !party || party.user_id !== user.id) {
      return NextResponse.json({ error: "Party not found or access denied" }, { status: 403 })
    }

    const now = Date.now()
    const payload = {
      partyId: String(partyId),
      iat: now,
      exp: now + ttlSec * 1000,
      nonce: randomUUID(),
    }
    const token = await signPayload(payload)
    const origin = url.origin
    const deepLink = buildDeepLinkUrl(origin, String(partyId), token)

    // Encode QR code
    const qr = await QRCode.toDataURL(deepLink, { errorCorrectionLevel: "M" })

    return NextResponse.json({ deepLink, token, qr })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to generate link" }, { status: 500 })
  }
} 