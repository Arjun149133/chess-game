import express from "express";
import authRouter from "./routes/auth";
import userRouter from "./routes/users";
import cookieParser from "cookie-parser";
import session from "express-session";

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

app.use("/auth", authRouter);
app.use("/users", userRouter);

app.listen(5000, () => console.log("Server running on port 5000"));
