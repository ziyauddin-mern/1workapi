import socket from "../lib/socket.lib";
import "dotenv/config";
import "../lib/db.lib";
import cors from "cors";
import crypto from "crypto-js";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const app = express();
socket(app);

// Routes
import invitationRouter from "./invitation/invitation.routes";
import userRouter from "./user/user.routes";

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/test", (req: Request, res: Response) => {
  res.json({ success: true });
});

app.use("/user", userRouter);

app.use("/invitation", invitationRouter);
