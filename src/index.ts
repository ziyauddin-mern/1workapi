import "dotenv/config";
import "../lib/db.lib";
import express, { Request, Response } from "express";

const app = express();

app.listen(8080);

app.get("/", (req: Request, res: Response) => {
  res.send("success setup");
});
