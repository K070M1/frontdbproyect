import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../axios';
import { Usuario } from '@/types/entities/Usuario';

const ENDPOINT = "users";

// Obtener todos los usuarios
export const useGetUsers = () => {
  return useQuery<Usuario[]>({
    queryKey: [ENDPOINT],
    queryFn: async () => {
      const { data } = await axios.get(`/${ENDPOINT}`);
      return data;
    }
  });
};

// Obtener usuario por ID
export const useGetUserById = (id: string) => {
  return useQuery<Usuario>({
    queryKey: [ENDPOINT, id],
    queryFn: async () => {
      const { data } = await axios.get(`/${ENDPOINT}/${id}`);
      return data;
    },
    enabled: !!id, // importante (para evitar llamadas innecesarias)
  });
};

// Registrar un nuevo usuario
export const useAddUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (form: Partial<Usuario>) => {
      const { data } = await axios.post(`/${ENDPOINT}`, form);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINT] });
    }
  });
};

export const useLocationUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, form }: { id: number; form: any }) => {
      const { data } = await axios.put(`/${ENDPOINT}/position/${id}`, form);
      return data;
    }
  });
};

export const getRouteSecure = () => {
  return useMutation({
    mutationFn: async (form: Partial<Usuario>) => {
      const { data } = await axios.post(`/${ENDPOINT}/route-secure`, form);
      return data;
    }
  });
};


// Actualizar un usuario
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, form }: { id: string; form: Partial<Usuario> }) => {
      const { data } = await axios.put(`/${ENDPOINT}/${id}`, form);
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
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`/${ENDPOINT}/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINT] });
    }
  });
};
