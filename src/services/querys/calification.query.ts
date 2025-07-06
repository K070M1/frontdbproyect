import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../axios'

const ENDPOINT = "calification"

// Obtener todas las calificaciones
export const useGetCalifications = () => {
  return useQuery({
    queryKey: [ENDPOINT],
    queryFn: async () => {
      const { data } = await axios.get(`/${ENDPOINT}`) 
      return data
    }
  })
}

// Registrar una nueva calificación
export const useAddCalification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (form) => {
      const { data } = await axios.post(`/${ENDPOINT}`, form);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINT] });
    }
  });
};

// Obtener una calificación
export const useGetCalification = () => {
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.get(`/${ENDPOINT}/${id}`);
      return data;
    }
  });
};

// Actualizar una calificación
export const useUpdateCalification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, form }: { id:any, form:any}) => {
      const { data } = await axios.put(`/${ENDPOINT}/${id}`, form );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINT] });
    }
  });
};

// Eliminar una calificación
export const useDeleteCalification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.delete(`/${ENDPOINT}/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINT] });
    }
  });
};