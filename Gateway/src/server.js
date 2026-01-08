import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";

const app = express();
const GATEWAY_PORT = process.env.GATEWAY_PORT;

app.use(express.json());

//! req: from client
//! res: to client
//! proxyReq: 
//! proxyRes: response from the backend
app.use((req, res)=>{
    const options = {
        hostname: "localhost",
        port: 8005,
        path: req.originalUrl,
        method: req.method,
        headers: req.headers
    };

    const proxyReq = http.request(options, proxyRes=>{
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
    });

    proxyReq.on("error", err=>{
        res.status(502).json({msg: "Bad gateway", error: err.message});
    });

    req.pipe(proxyReq);
})


app.listen(GATEWAY_PORT, ()=>{
    console.log("API Gateway is running on PORT: ", GATEWAY_PORT)
})