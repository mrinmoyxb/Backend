import dotenv from "dotenv";
dotenv.config();

import express from "express";
import userModel from "./model/userMode";
import bcrypt from "bcrypt";
import { connectToDB } from "./util/connect";

const app = express();
connectToDB();


app.use(express.json());
app.use(express.urlencoded({extended: false}));



app.get("/", (req, res) => {
  res.send("Hello from TS + Express 🚀");
});

app.post("/atlas/api/v1/user", async (req, res)=>{
  const {name, email, password} = req.body;
  if(!name || !email || !password){
    return res.status(400).json({msg: "all fields are required"});
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    name: name, 
    email: email,
    password: hashedPassword
  });

  console.log("USER: ", user);
  return res.status(200).json({msg: "user added to atlas successfully"});
})

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
