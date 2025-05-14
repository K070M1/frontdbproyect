import { mockCalificaciones } from '@/data/mockCalificaciones';

export const CalificacionesAPI = {
  getAll: async () => {
    await new Promise((res) => setTimeout(res, 500));
    return mockCalificaciones;
  },

  add: async (nueva: typeof mockCalificaciones[0]) => {
    console.log('Simulando agregar calificación:', nueva);
    return { success: true };
  },
};
