import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  { path: "/dashboard", roles: ["admin", "usuario"] },
  { path: "/perfil", roles: ["admin", "usuario"] },
  { path: "/configuracion", roles: ["admin"] },
];

type TokenPayload = {
  id: number;
  rol: string;
  iat: number;
  exp: number;
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  return NextResponse.next();
}

export const config = {
  matcher: protectedRoutes.map((r) => `${r.path}{/}?`),
};
