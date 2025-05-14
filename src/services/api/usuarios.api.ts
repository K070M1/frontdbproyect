import { mockUsers } from '@/data/mockUsers';

export const UsuariosAPI = {
  getAll: async () => {
    await new Promise((res) => setTimeout(res, 500));
    return mockUsers;
  },

  getById: async (id: number) => {
    await new Promise((res) => setTimeout(res, 300));
    return mockUsers.find((u) => u.id === id) || null;
  },
};
