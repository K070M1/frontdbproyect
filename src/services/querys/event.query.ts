import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../axios'

const ENDPOINT = "events"

// Obtener todos los eventos
export const useGetEvents = () => {
  return useQuery({
    queryKey: [ENDPOINT],
    queryFn: async () => {
      const { data } = await axios.get(`/${ENDPOINT}`) 
      return data
    }
  })
}

// Registrar un nuevo evento
export const useAddEvent = () => {
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

// Obtener un evento
export const useGetEvent = () => {
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.get(`/${ENDPOINT}/${id}`);
      return data;
    }
  });
};

// Actualizar un evento
export const useUpdateEvent = () => {
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

// Eliminar un evento
export const useDeleteEvent = () => {
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