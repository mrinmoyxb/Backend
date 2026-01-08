import dotenv from "dotenv";
dotenv.config();

import express from "express";


const app = express()
const PORT = process.env.PORT;

app.use(express.json());

app.get("/test", (req, res)=>{
    res.json({msg: "Hello from backend", path: req.path});
})

app.post("/echo", (req, body)=>{
    res.json({body: req.body});
});

app.listen(PORT, ()=>{
    console.log("Backend server is running on PORT: ", PORT);
})