import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export async function middleware(req: NextRequest) {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  // Allow access to the sign-in and sign-up pages for visitors
  if (
    req.nextUrl.pathname.startsWith("/visitor/sign-in") ||
    req.nextUrl.pathname.startsWith("/visitor/sign-up")
  ) {
    return NextResponse.next();
  }

  // Allow access to the sign-in and sign-up pages for users
  if (
    req.nextUrl.pathname.startsWith("/user/sign-in") ||
    req.nextUrl.pathname.startsWith("/user/sign-up")
  ) {
    return NextResponse.next();
  }

  if (!session) {
    // Redirect unauthorized users to the visitor path
    const url = req.nextUrl.clone();
    url.pathname = `/visitor${req.nextUrl.pathname}`;
    return NextResponse.rewrite(url);
  } else {
    const user = session.user;
    const isAnonymous = user?.app_metadata?.provider === "anonymous";

    if (isAnonymous) {
      // Allow anonymous users to stay on the current path
      return NextResponse.next();
    } else {
      // Redirect authorized (non-anonymous) users to the user path
      const url = req.nextUrl.clone();
      url.pathname = `/user${req.nextUrl.pathname}`;
      return NextResponse.rewrite(url);
    }
  }
}
