import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import puppeteer from "puppeteer";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "src")));
app.use(
  "/lib/snarkdown",
  express.static(path.join(__dirname, "node_modules/snarkdown/dist"))
);
app.use(
  "/lib/dompurify",
  express.static(path.join(__dirname, "node_modules/dompurify/dist"))
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "index.html"));
});

app.listen(port, () =>
  console.log(`server is listening on http://localhost:${port}`)
);
