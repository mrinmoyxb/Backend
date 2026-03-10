import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "http://127.0.0.1:5501"
    }
});

io.on("connection", (socket)=>{
    console.log("Client connected: ", socket.id);
    socket.emit("msg", "Hello client, I'm server");
    socket.on("msg", (data)=>{
        console.log("Messgae from client: ", data);
    })
})

httpServer.listen(3000, ()=>{
    console.log("Server is running on PORT: 3000");
});