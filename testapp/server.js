import express from "express"
import { MongoClient } from "mongodb";

const app = express();
const PORT = 5050;

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

const MONGO_URL = "mongodb://admin:qwerty@localhost:27017/?authSource=admin";
const client = new MongoClient(MONGO_URL);

let db;

async function connectDB() {
    await client.connect();
    console.log("Connected successfully to MongoDB");
    db = client.db("dockerdb");
}

connectDB();

app.get("/getusers", async (req, res) => {
    const data = await db.collection("users").find({}).toArray();
    res.send(data);
});

app.post("/adduser", async (req, res) => {
    const userObj = req.body;

    await db.collection("users").insertOne(userObj);

    res.status(201).json({ msg: "Inserted successfully" });
});

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});