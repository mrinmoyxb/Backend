import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket)=>{
    console.log("Client connected: ", socket.id);
    socket.on("message", (data)=>{
        console.log("Message from client: ", data);
    })
    socket.emit("message", "Hello client");
});

httpServer.listen(3001, ()=>{
    console.log("Server is running on PORT: 3001");
})