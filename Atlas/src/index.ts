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

//! POST: add data to atlas
app.post("/atlas/api/v1/user", async (req, res)=>{
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "all fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name: name,
      email: email,
      password: hashedPassword
    });

    console.log("USER: ", user);
    return res.status(200).json({ msg: "user added to atlas successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "internal server error" });
  }
})

//! GET: fetch data from atlas
app.get("/atlas/api/v1/user/:id", async (req, res)=>{
  try {
    const id = req.params.id;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    } else {
      return res.status(200).json({ msg: user });
    }
  } catch (error) {
    return res.status(500).json({ msg: "internal server error" });
  }
})

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
