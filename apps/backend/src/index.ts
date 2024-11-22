import express from "express";
import authRouter from "./routes/auth";
import userRouter from "./routes/users";
import cookieParser from "cookie-parser";
import session from "express-session";
import "dotenv/config";
import { initPassport } from "./lib/passport";
import passport from "passport";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);
initPassport();
app.use(passport.initialize());
app.use(passport.authenticate("session"));

const allowedHosts = process.env.ALLOWED_HOSTS
  ? process.env.ALLOWED_HOSTS.split(",")
  : [];

console.log(allowedHosts);

app.use(
  cors({
    origin: allowedHosts,
    methods: "GET,POST,PUT,DELETE,HEAD, OPTIONS",
    credentials: true,
  })
);

app.use("/auth", authRouter);
app.use("/users", userRouter);

app.listen(5000, () => console.log("Server running on port 5000"));
