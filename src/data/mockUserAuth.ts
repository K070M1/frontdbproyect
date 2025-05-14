import { mockUsers } from './mockUsers';

// Estado global del usuario autenticado
export let mockUserAuth = mockUsers[1]; // Por defecto: usuario normal

// Función para simular login
export const loginMock = (username: string, password: string) => {
  const user = mockUsers.find((u) => u.username === username && u.password === password);

  if (user) {
    mockUserAuth = user;
    return { success: true, user };
  }

  return { success: false, message: 'Credenciales inválidas' };
};

// Función para simular logout
export const logoutMock = () => {
  mockUserAuth = mockUsers[1]; // Resetea a usuario normal
};
