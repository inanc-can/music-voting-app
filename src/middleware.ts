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

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
