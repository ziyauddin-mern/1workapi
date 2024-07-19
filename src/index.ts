import "dotenv/config";
import "../lib/db.lib";
import cors from "cors";
import crypto from "crypto-js";
import express, { Request, Response } from "express";

const app = express();

app.listen(8080);

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use((req, res, next) => {
  const cypherText = req.headers["x-user-agent"];
  if (!cypherText) return res.status(400).send("Invalid request !");

  const bytes = crypto.AES.decrypt(
    cypherText as string,
    process.env.USER_AGENT_SECRET as string
  );

  const decryptedData = bytes.toString(crypto.enc.Utf8);

  if (!decryptedData) return res.status(400).send("Invalid request !");
  next();
});

app.get("/test", (req: Request, res: Response) => {
  res.json({ success: true });
});
const demo = "tst";
