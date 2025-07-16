import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../axios';

type LoginForm = {
  correo: string;
  clave: string;
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (form: LoginForm) => {
      const { data } = await api.post('/auth/login', form);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(); // Actualiza datos protegidos
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout');
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
