import express from "express";
const PORT = 8002;
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
    return res.json({ status: "Server is up and running" });
});
app.listen(PORT, () => {
    console.log("Server is running on PORT: ", PORT);
});
//# sourceMappingURL=index.js.map