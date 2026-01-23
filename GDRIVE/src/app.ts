import dotenv from "dotenv";
dotenv.config();

import express from "express";

const app = express();
const PORT = Number(process.env.PORT) || 9009;

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT: ${PORT}`);
})