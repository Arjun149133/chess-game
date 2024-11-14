import express from "express";
import authRouter from "./routes/auth";

const app = express();

app.use("/auth", authRouter);

app.listen(5000, () => [console.log("App listening on port 5000")]);
