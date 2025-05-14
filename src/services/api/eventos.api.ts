import { mockEventos } from '@/data/mockEventos';

export const EventosAPI = {
  getAll: async () => {
    await new Promise((res) => setTimeout(res, 500));
    return mockEventos;
  },

  reportar: async (evento: typeof mockEventos[0]) => {
    console.log('Simulando reporte de evento:', evento);
    return { success: true };
  },
};
