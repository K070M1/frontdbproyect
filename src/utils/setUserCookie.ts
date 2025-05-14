// import { cookies } from 'next/headers';

export const setUserCookie = (user: {
  id: number;
  username: string;
  role: string;
  nombre: string;
  correo: string;
  fechaRegistro: string;
}) => {
  if (typeof window !== "undefined") {
    document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/;`;
  }
};
