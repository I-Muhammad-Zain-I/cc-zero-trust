import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { hostname } from "os";

const app = express();
app.use(cors());
const port = 4000;

app.get("/context/:userId", (req, res) => {
  console.log("GET /context/:userId");
  const { userId } = req.params;
  console.log({ userAgent: req.headers["user-agent"] });
  console.log({ userId });
  const file = path.join("data", `${userId}.json`); // Removed __dirname since it's not available in ESM

  if (!fs.existsSync(file)) {
    console.log("File not found");
    return res.status(404).json({ error: "Not found" });
  }
  const payload = JSON.parse(fs.readFileSync(file, "utf8"));
  res.json(payload);
});

app.listen(port, () => {
  console.log(`CONTEXT server listening on ${port}`);
});
