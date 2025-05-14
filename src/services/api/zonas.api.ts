import { mockZonas } from '@/data/mockZonas';

export const ZonasAPI = {
  getAll: async () => {
    await new Promise((res) => setTimeout(res, 500));
    return mockZonas;
  },

  getById: async (id: number) => {
    await new Promise((res) => setTimeout(res, 300));
    return mockZonas.find((z) => z.id === id) || null;
  },
};
