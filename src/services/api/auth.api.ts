import { mockUsers } from '@/data/mockUsers';

export const AuthAPI = {
  login: async (username: string, password: string) => {
    await new Promise((res) => setTimeout(res, 500));

    const user = mockUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      const fakeToken = btoa(`${username}:${Date.now()}`);
      return { access_token: fakeToken, role: user.role, username: user.username };
    }

    throw new Error('Credenciales inválidas');
  },

  logout: async () => {
    await new Promise((res) => setTimeout(res, 200));
    return { success: true };
  },
};
