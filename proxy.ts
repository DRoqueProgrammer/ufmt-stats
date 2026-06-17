import { NextResponse, type NextRequest } from "next/server";

/** Strip the demo admin cookie from /admin responses when Supabase Auth is
 *  the active auth path. Prevents a stale cookie from granting access via
 *  the demo code path if env changes after deployment.
 *  The real per-page auth guard is requireAdmin() in lib/admin-auth.ts. */
export function proxy(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const res = NextResponse.next();
    res.cookies.set("ufmt_admin", "", { maxAge: 0, path: "/" });
    return res;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
