import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../axios";
import { Ubicacion } from "@/types/entities/Ubicacion";
import { CrearUbicacionDTO } from "@/types/dto/CrearUbicacionDTO";
import { ActualizarUbicacionDTO } from "@/types/dto/ActualizarUbicacionDTO";

const ENDPOINT = "location";

// Obtener todas las ubicaciones
export const useGetUbicaciones = () => {
  return useQuery<Ubicacion[]>({
    queryKey: [ENDPOINT],
    queryFn: async () => {
      const { data } = await axios.get(`/${ENDPOINT}`);
      return data;
    },
  });
};

// Obtener una ubicación por ID
export const useGetUbicacionById = (id: string | number) => {
  return useQuery<Ubicacion>({
    queryKey: [ENDPOINT, id],
    queryFn: async () => {
      const { data } = await axios.get(`/${ENDPOINT}/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// Crear una ubicación
export const useAddUbicacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (form: CrearUbicacionDTO) => {
      const { data } = await axios.post(`/${ENDPOINT}`, form);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINT] });
    },
  });
};

// Actualizar una ubicación (usamos PUT)
export const useUpdateUbicacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      form,
    }: {
      id: string | number;
      form: ActualizarUbicacionDTO;
    }) => {
      const { data } = await axios.put(`/${ENDPOINT}/${id}`, form);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINT] });
    },
  });
};

// Eliminar una ubicación
export const useDeleteUbicacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => {
      const { data } = await axios.delete(`/${ENDPOINT}/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ENDPOINT] });
    },
  });
};
