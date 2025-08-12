import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/deeplink";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Error fetching session:", error);
  }

  // Handle deep-link tokens directly on visitor party path
  const incomingUrl = req.nextUrl.clone();
  const hasToken = incomingUrl.searchParams.has("t");
  if (incomingUrl.pathname.startsWith("/visitor/party/") && hasToken) {
    const partyId = incomingUrl.pathname.split("/visitor/party/")[1]?.split("/")[0];
    const token = incomingUrl.searchParams.get("t") as string;

    if (partyId && token) {
      const payload = await verifyToken(token);
      if (!payload || payload.partyId !== String(partyId)) {
        const errUrl = incomingUrl.clone();
        errUrl.pathname = "/visitor/opener";
        errUrl.searchParams.set("error", "invalid_or_expired");
        return NextResponse.redirect(errUrl);
      }

      // Ensure session (anonymous if necessary)
      const { data: sessData } = await supabase.auth.getSession();
      if (!sessData?.session) {
        await supabase.auth.signInAnonymously();
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Verify party exists and is active
        const { data: party } = await supabase
          .from("parties")
          .select("*")
          .eq("id", partyId)
          .maybeSingle();

        const isEnded = (party as any)?.ended_at != null;
        const isExplicitlyInactive = (party as any)?.is_active === false;
        if (!party || isEnded || isExplicitlyInactive) {
          const errUrl = incomingUrl.clone();
          errUrl.pathname = "/visitor/opener";
          errUrl.searchParams.set("error", "party_inactive");
          return NextResponse.redirect(errUrl);
        }

        // Join participant if not already joined
        const { data: existing } = await supabase
          .from("partyparticipants")
          .select("id")
          .eq("party_id", partyId)
          .eq("user_id", user.id)
          .maybeSingle();

        if (!existing) {
          await supabase
            .from("partyparticipants")
            .insert({ party_id: partyId, user_id: user.id });
        }
      }

      // Clean URL by removing token
      const clean = incomingUrl.clone();
      clean.searchParams.delete("t");
      return NextResponse.redirect(clean);
    }
  }

  // Allow access to the sign-in and sign-up pages for visitors
  if (
    req.nextUrl.pathname.startsWith("/visitor/sign-in") ||
    req.nextUrl.pathname.startsWith("/visitor/sign-up")
  ) {
    return res;
  }

  // Allow access to the sign-in and sign-up pages for users
  if (
    req.nextUrl.pathname.startsWith("/user/sign-in") ||
    req.nextUrl.pathname.startsWith("/user/sign-up")
  ) {
    return res;
  }

  if (!session || session.user.is_anonymous) {
    // Check if the anonymous user is already in a party
    const { data: partyParticipant, error } = await supabase
      .from("partyparticipants")
      .select("party_id")
      .eq("user_id", session?.user?.id)
      .maybeSingle();

    if (partyParticipant) {
      // Redirect anonymous user to the party page
      const url = req.nextUrl.clone();
      url.pathname = `/visitor/party/${partyParticipant.party_id}`;
      return NextResponse.rewrite(url);
    } else {
      // Redirect unauthorized users to the visitor path
      const url = req.nextUrl.clone();
      url.pathname = `/visitor${req.nextUrl.pathname}`;
      return NextResponse.rewrite(url);
    }
  } else {
    // Check if the user is already in a party
    const { data: partyParticipant, error } = await supabase
      .from("partyparticipants")
      .select("party_id")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (partyParticipant) {
      // Redirect user to the party page
      const url = req.nextUrl.clone();
      url.pathname = `/visitor/party/${partyParticipant.party_id}`;
      return NextResponse.rewrite(url);
    } else {
      // Redirect authorized users to the user path
      const url = req.nextUrl.clone();
      url.pathname = `/user${req.nextUrl.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
