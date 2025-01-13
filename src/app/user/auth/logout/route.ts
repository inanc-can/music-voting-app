import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Handle POST requests to sign out a user
export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const cookieStore = cookies();

  // Create a new instance of the Supabase client
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  });

  await supabase.auth.signOut();

  return NextResponse.redirect(url.origin, {
    status: 301,
  });
}
