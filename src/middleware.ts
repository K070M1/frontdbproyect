import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  { path: "/dashboard", roles: ["admin", "usuario"] },
  { path: "/perfil", roles: ["admin", "usuario"] },
  { path: "/configuracion", roles: ["admin"] },
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const route = protectedRoutes.find((r) => pathname.startsWith(r.path));
  if (!route) return NextResponse.next();

  const userCookie = request.cookies.get("user");
  if (!userCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let user: { rol: string } | null = null;
  try {
    user = JSON.parse(decodeURIComponent(userCookie.value));
  } catch (error) {
    console.error("Error parsing user cookie:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!user || !user.rol) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!route.roles.includes(user.rol)) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: protectedRoutes.map((r) => `${r.path}{/}?`),
};
