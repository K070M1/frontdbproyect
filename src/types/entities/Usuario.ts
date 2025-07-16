export interface Usuario {
  id_usuario: number;
  nombre_usuario: string;
  clave: string;
  rol: 'usuario' | 'admin' | 'moderador' | null;
  correo: string;
  created_at: string; // ISO Date
  updated_at: string; // ISO Date
  activo: boolean;
  avatar_url?: string;
}
