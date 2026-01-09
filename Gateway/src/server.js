import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { gatewayMiddleware } from "./middlewares/gateway.js";
import { mutateHeader } from "./middlewares/mutateHeader.js";

const app = express();
const GATEWAY_PORT = process.env.GATEWAY_PORT;
app.get("/health", (req, res)=>{
    res.json({status: "ok"});
})

app.use(express.json());
app.use(mutateHeader);
app.use(gatewayMiddleware);

app.listen(GATEWAY_PORT, ()=>{
    console.log("API Gateway is running on PORT: ", GATEWAY_PORT)
})