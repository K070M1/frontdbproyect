import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../axios'

const ENDPOINT = "type-event";

// Obtener todos los tipos de evento
export const useGetTypeEvents = () => {
  return useQuery({
    queryKey: [ENDPOINT],
    queryFn: async () => {
      const { data } = await axios.get(`/${ENDPOINT}`) 
      return data
    }
  })
}

// Registrar un nuevo tipo de evento
export const useAddTypeEvent = () => {
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

// Obtener un tipo de evento
export const useGetTypeEvent = () => {
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.get(`/${ENDPOINT}/${id}`);
      return data;
    }
  });
};

// Actualizar un tipo de evento
export const useUpdateTypeEvent = () => {
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

// Eliminar un tipo de evento
export const useDeleteTypeEvent = () => {
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