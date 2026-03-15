import express from "express"
import { MongoClient } from "mongodb";

const app = express();
const PORT = 5050;

const MONGO_URL = "mongodb://admin:qwerty@localhost:27018/";
const client = new MongoClient(MONGO_URL);

let db;

async function connectDB() {
    await client.connect();
    console.log("Connected successfully to MongoDB");
    db = client.db("dockerdb");
}
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/getusers", async (req, res) => {
    const data = await db.collection("users").find({}).toArray();
    res.send(data);
});

app.post("/adduser", async (req, res) => {
    try {
        console.log(req.body);

        const userObj = req.body;

        const result = await db.collection("users").insertOne(userObj);

        console.log(result);

        res.status(201).json({ msg: "Inserted successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error inserting user");
    }
});

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});