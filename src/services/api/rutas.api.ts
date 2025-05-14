import { mockRutas } from '@/data/mockRutas';

export const RutasAPI = {
  getAll: async () => {
    await new Promise((res) => setTimeout(res, 500));
    return mockRutas;
  },

  getById: async (id: number) => {
    await new Promise((res) => setTimeout(res, 300));
    return mockRutas.find((r) => r.id_ruta === id) || null;
  },

  add: async (nuevaRuta: typeof mockRutas[0]) => {
    console.log('Simulando agregar ruta:', nuevaRuta);
    return { success: true };
  },

  delete: async (id: number) => {
    console.log('Simulando eliminar ruta id:', id);
    return { success: true };
  },
};
