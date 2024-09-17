import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check for authorization (this is just an example, adjust according to your auth logic)
  const isAuthorized = request.cookies.get("auth-token");

  if (!isAuthorized) {
    // Redirect to the search page if not authorized
    return NextResponse.redirect(new URL("/search", request.url));
  }

  // Continue to the requested page if authorized
  return NextResponse.next();
}

// Specify the paths where the middleware should run
export const config = {
  matcher: ["/protected-path/:path*"], // Adjust this to match your protected routes
};
