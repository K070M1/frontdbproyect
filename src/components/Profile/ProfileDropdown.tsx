"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ProfileDropdown.module.css';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    console.log('Cerrar sesión');
    // pendient - lógica real de logout simulada.
  };

  const handleEditProfile = () => {
    router.push('/perfil/editar');
    setIsOpen(false);
  };

  return (
    <div className={styles.container}>
      <button className={styles.avatarButton} onClick={toggleDropdown}>
        <span className={styles.avatar}>👤</span>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <button onClick={() => router.push('/perfil')} className={styles.item}>
            Perfil
          </button>
          <button onClick={handleEditProfile} className={styles.item}>
            Editar Perfil
          </button>
          <button onClick={handleLogout} className={styles.item}>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
