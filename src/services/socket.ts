import { create } from 'zustand'
import socket from './socket-config'

interface SocketState {
  emitSocket: any;
  socketId: string | null;
  initSocket: () => void;
  sendSocket: (by: any) => void;
}

export const useSocketStore = create<SocketState>()(
  (set) => ({
    emitSocket: null,
    socketId: null,
    initSocket: async () => {
      // Cuando se conecta
      socket.on('connect', () => {
        console.log("Socket conectado:", socket.id);
        set({ socketId: socket.id });
      });

      // Cuando recibe datos
      socket.on('send_data', (res) => {
        console.log("Datos recibidos:", res);
        set({ emitSocket: res });
      });
    },
    sendSocket: (by) => {
      socket.emit('send_data', by)
    }
  })
)