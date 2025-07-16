import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../axios'

const ENDPOINT = "zones"

// Obtener todos las zonas
export const useGetZones = () => {
  return useQuery({
    queryKey: [ENDPOINT],
    queryFn: async () => {
      const { data } = await axios.get(`/${ENDPOINT}`) 
      return data
    }
  })
}

// Registrar un nueva zona
export const useAddZone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (form:any) => {
      const { data } = await axios.post(`/${ENDPOINT}`, form);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINT] });
    }
  });
};

// Obtener una zona
export const useGetZone = () => {
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.get(`/${ENDPOINT}/${id}`);
      return data;
    }
  });
};

// Actualizar una zona
export const useUpdateZone = () => {
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

// Eliminar una zona
export const useDeleteZone = () => {
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