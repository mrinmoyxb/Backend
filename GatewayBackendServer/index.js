import dotenv from "dotenv";
dotenv.config();

import express from "express";


const app = express()
const PORT = process.env.PORT;

app.use(express.json());

app.get("/test", (req, res)=>{
    console.log("body: ", req.body);
    console.log();
    console.log("base url: ", req.baseUrl);
    console.log();
    console.log("headers: ", req.headers);
    console.log();
    res.json({msg: "Hello from backend", path: req.path});
})

app.post("/echo", (req, body)=>{
    res.json({body: req.body});
});

app.listen(PORT, ()=>{
    console.log("Backend server is running on PORT: ", PORT);
})