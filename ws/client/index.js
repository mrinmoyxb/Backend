const socket = io("http://localhost:3001");

socket.on("connect", ()=>{
    console.log("Connected to the server: ", socket.id);

    socket.emit("message", "Hello server, I'm client");
})

socket.on("message", (data)=>{
    console.log("Message from server: ", data);
})