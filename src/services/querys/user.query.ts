import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../axios'

const ENDPOINT = "users"

// Obtener todos los usuarios
export const useGetUsers = () => {
  return useQuery({
    queryKey: [ENDPOINT],
    queryFn: async () => {
      const { data } = await axios.get(`/${ENDPOINT}`) 
      return data
    }
  })
}

// Registrar un nuevo usuario
export const useAddUser = () => {
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

// Obtener un usuario
export const useGetUser = () => {
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.get(`/${ENDPOINT}/${id}`);
      return data;
    }
  });
};

// Actualizar un usuario
export const useUpdateUser= () => {
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

// Eliminar un usuario
export const useDeleteUser = () => {
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