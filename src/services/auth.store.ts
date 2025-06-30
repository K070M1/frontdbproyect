import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthState {
  token: string;
  setToken: (by: string) => void;
  user: any;
  setUser: (by: any) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: "",
      setToken: (by) => { set(() => ({ token: by })) },
      user: null,
      setUser: (by) => { set(() => ({ user: by })) }
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage)
    }
  )
)