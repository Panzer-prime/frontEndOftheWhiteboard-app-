// utils/connectOnSocket.js
import { io, Socket } from "socket.io-client";

const URL =
  process.env.NODE_ENV === "production" ? undefined : "http://127.0.0.1:5000";

let socket: Socket;


export function ConnectOnSocket() {
  if (!socket) {
    socket = io(URL as string, {
      autoConnect: false,
    });
    try {
      socket.on("connect", () => {
        console.log("Connected to socket with server ", socket.id);
        socket.emit("message", "server is connected with client");
      });
  
      
      socket.on("disconnect", () => {
        console.log("Disconnected from server: " + socket.id);
      });
  
      socket.io.engine.on("upgrade", (transport) => {
        console.log("Transport: " + transport.name);
      });
      
      socket.on("message", (data: string) => {
        console.log("Message: " + data);
      });
  
      socket.on("connect_error", (err: any) => {
        console.log(err.message);
        console.log(err.description);
        console.log(err.context);
      });
    } catch (error) {
      console.log(error)
    }
    
  }

  return { socket };
}
