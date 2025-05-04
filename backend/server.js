import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.post("/api", (req, res) => {
  console.count("route hit");
  res.status(200).json("Transaction Success");
});
app.get("/api/check", (req, res) => {
  console.count("route hit");
  res.status(200).json("Api hit successful");
});

app.listen(3000, () => {
  console.log("SERVER STARTED ON PORT 3000");
});
