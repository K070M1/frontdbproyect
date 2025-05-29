import { useState, useEffect } from 'react';
import { User } from "@/types/entities/User";

export function useMe() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (!res.ok) {
          throw new Error('No autorizado');
        }
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError((err as Error).message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  return { user, loading, error };
}
