import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../axios';
import {
  Ruta,
  CrearRutaPayload,
  ActualizarRutaPayload,
} from '@/types/entities/Ruta';

const ENDPOINT = 'routes';

// Obtener todas las rutas
export const useGetRoutes = () => {
  return useQuery<any[]>({
    queryKey: [ENDPOINT],
    queryFn: async () => {
      const { data } = await axios.get(`/${ENDPOINT}`);
      return data;
    },
  });
};

// Obtener una ruta por ID (useQuery)
export const useGetRouteById = () => {
  return useMutation({
    mutationFn: async (id: any) => {
      const { data } = await axios.get(`/${ENDPOINT}/${id}`);
      return data
    },
  });
};

// Obtener una ruta por ID (useMutation)
export const useGetRoute = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axios.get(`/${ENDPOINT}/${id}`);
      return data as Ruta;
    },
  });
};

// Registrar una nueva ruta
export const useAddRoute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (form: CrearRutaPayload) => {
      const { data } = await axios.post(`/${ENDPOINT}`, form);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINT] });
    },
  });
};

// Actualizar una ruta
export const useUpdateRoute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      form,
    }: {
      id: number;
      form: any
    }) => {
      const { data } = await axios.put(`/${ENDPOINT}/${id}`, form);
      return data as Ruta;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINT] });
    },
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
    },
  });
};
