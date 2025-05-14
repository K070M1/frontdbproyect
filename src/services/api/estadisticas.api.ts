import { mockEstadisticas } from '@/data/mockEstadisticas';

export const EstadisticasAPI = {
  getSummary: async () => {
    await new Promise((res) => setTimeout(res, 500));
    return mockEstadisticas;
  },
};
