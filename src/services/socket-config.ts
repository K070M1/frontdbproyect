import { io } from 'socket.io-client'

const socket = io(`http://localhost:${process.env.PORT ?? 5001}`, {
  reconnectionDelayMax: 10000,
  auth: { token: "123" },
  query: { "nameRoom": "SOCKET" }
});

export default socket;