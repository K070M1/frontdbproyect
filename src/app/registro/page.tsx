"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import RegisterForm from '@/components/Forms/RegisterForm';
import LayoutShell from '@/components/Layout/LayoutShell';
import styles from './page.module.css';

export default function RegistroPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (user) {
      router.replace('/perfil');
    } else {
      setChecking(false);
    }
  }, [user, router]);

  if (checking) return null;

  return (
    <LayoutShell>
      <main className={styles.registerPage}>
        <RegisterForm />
      </main>
    </LayoutShell>
  );
}
