import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

let playScores = [];

io.on("connection", (socket)=>{
    console.log("Client connected: ", socket.id);
    socket.on("message", (data)=>{
        console.log("Message from client: ", data);
    })
    socket.emit("message", "Hello client");


    socket.on("score", (data)=>{
        playScores.push({...data, id: socket.id});
    })

    console.log("SCORES: ", playScores);
    setInterval(()=>{
        socket.emit("playerScores", playScores);
    }, 5000);
    
});

httpServer.listen(3001, ()=>{
    console.log("Server is running on PORT: 3001");
})