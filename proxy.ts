import { NextResponse, type NextRequest } from "next/server";

/** Redireciona /admin → /admin (se logado) ou /admin/login (se não).
 *  O guard final é feito em cada page.tsx via requireAdmin().
 *  Aqui só evitamos exposição de cookies desnecessários em rotas públicas.
 */
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
