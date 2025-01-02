import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

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
      .single();

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
      .single();

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
