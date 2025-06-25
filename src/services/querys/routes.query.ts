import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../axios';

const ENDPOINT = "routes";

// Tipo de datos para una ruta
export type Route = {
  id_ruta: number;
  id_origen: number;
  id_destino: number;
  riesgo: number;
  tiempo_estimado: string;
  favorito: boolean;
};

// Tipo para crear/actualizar rutas
export type RouteForm = Omit<Route, "id_ruta">;

// Obtener todas las rutas
export const useGetRoutes = () => {
  return useQuery<Route[]>({
    queryKey: [ENDPOINT],
    queryFn: async () => {
      const { data } = await axios.get(`/${ENDPOINT}`);
      return data as Route[];
    }
  });
};

// Registrar una nueva ruta
export const useAddRoute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (form: any) => {
      const { data } = await axios.post(`/${ENDPOINT}`, form);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINT] });
    }
  });
};

// Obtener una ruta por ID
export const useGetRoute = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axios.get(`/${ENDPOINT}/${id}`);
      return data as Route;
    }
  });
};

// Actualizar una ruta
export const useUpdateRoute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, form }: { id: number; form: RouteForm }) => {
      const { data } = await axios.put(`/${ENDPOINT}/${id}`, form);
      return data as Route;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINT] });
    }
  });
};

// Eliminar una ruta
export const useDeleteRoute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axios.delete(`/${ENDPOINT}/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINT] });
    }
  });
};
