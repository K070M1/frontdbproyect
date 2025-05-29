import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const TOKEN_SECRET = process.env.NEXT_PUBLIC_TOKEN_SECRET;
if (!TOKEN_SECRET) {
  throw new Error('❌ NEXT_PUBLIC_TOKEN_SECRET no está definido en .env.local');
}

const secretKey = new TextEncoder().encode(TOKEN_SECRET);

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'No autorizado (token faltante)' }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, secretKey) as { payload: { id: number; rol: string } };

    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';
    const res = await fetch(`${backendURL}/users/${payload.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    const user = await res.json();

    return NextResponse.json({
      id: user.id_usuario,
      username: user.nombre_usuario,
      email: user.correo,
      rol: user.rol,
    });
  } catch (error) {
    console.error('Token inválido:', error);
    return NextResponse.json({ message: 'No autorizado (token inválido)' }, { status: 401 });
  }
}
