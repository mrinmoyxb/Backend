const socket = io("http://localhost:3000");

socket.on("connect", (response)=>{
    console.log("Connected to server: ", socket.id);
    console.log("Response: ", response);
})

socket.emit("msg", "Hello server, I'm client");

socket.on("msg", (data)=>{
    console.log("Message from server: ", data);
})