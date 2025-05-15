import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = [
  { path: "/dashboard", roles: ["admin", "usuario"] },
  { path: "/perfil", roles: ["admin", "usuario"] },
  { path: "/configuracion", roles: ["admin"] },
];

const TOKEN_SECRET = process.env.NEXT_PUBLIC_TOKEN_SECRET;
if (!TOKEN_SECRET) {
  throw new Error("❌ NEXT_PUBLIC_TOKEN_SECRET no está definido en .env.local");
}

const secretKey = new TextEncoder().encode(TOKEN_SECRET);

type TokenPayload = {
  id: number;
  rol: string;
  iat: number;
  exp: number;
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const route = protectedRoutes.find((r) => pathname.startsWith(r.path));
  if (!route) return NextResponse.next();

  const tokenCookie = request.cookies.get("token");

  if (!tokenCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify<TokenPayload>(tokenCookie.value, secretKey);

    if (!payload.rol || !route.roles.includes(payload.rol)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    return NextResponse.next();

  } catch (error) {
    console.error("Token inválido o expirado:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: protectedRoutes.map((r) => `${r.path}{/}?`),
};
