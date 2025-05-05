import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
const PORT = 3000;

app.post("/api", (req, res) => {
  console.count("route hit");
  res.status(200).json("Transaction Success");
});
app.get("/api/check", (req, res) => {
  console.count("route hit");
  res.status(200).json("Api hit successful");
});

app.listen(PORT, () => {
  console.log(`MAIN server listening on http://localhost:${PORT}`);
});
