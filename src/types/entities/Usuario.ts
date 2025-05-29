export interface Usuario {
  id_usuario: number;
  nombre_usuario: string;
  clave: string;
  rol: string | null;
  correo: string;
  fecha_registro: string; // ISO Date (TIMESTAMP)
}
