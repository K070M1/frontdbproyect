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

function decodeJWT(token: string): TokenPayload | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(Buffer.from(payload, "base64").toString("utf-8"));
    return decoded;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const matched = protectedRoutes.find((r) => pathname.startsWith(r.path));
  if (!matched) return NextResponse.next();

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const user = decodeJWT(token);
  if (!user || !matched.roles.includes(user.rol)) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  const now = Math.floor(Date.now() / 1000);
  if (user.exp && user.exp < now) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/",
    "/perfil",
    "/perfil/",
    "/configuracion",
    "/configuracion/",
  ],
};
