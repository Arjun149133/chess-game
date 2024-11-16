import express, { json } from "express";
import authRouter from "./routes/auth";

const app = express();

app.use(express.json());

app.use("/auth", authRouter);

app.listen(5000, () => console.log("Server running on port 5000"));
