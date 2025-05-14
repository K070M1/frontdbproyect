import styles from './UserCard.module.css';

type UserCardProps = {
  nombre: string;
  correo: string;
  rol?: string;
  fechaRegistro?: string;
};

export default function UserCard({ nombre, correo, rol = 'Usuario', fechaRegistro }: UserCardProps) {
  return (
    <div className={styles.card}>
      <h3>{nombre}</h3>
      <p><strong>Correo:</strong> {correo}</p>
      <p><strong>Rol:</strong> {rol}</p>
      {fechaRegistro && <p><strong>Registrado el:</strong> {new Date(fechaRegistro).toLocaleDateString()}</p>}
    </div>
  );
}
