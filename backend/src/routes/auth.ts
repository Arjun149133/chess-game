import { Router } from "express";
import { registerHandler } from "../handlers/registerHandler";
import { loginFailed, loginHandler, logout } from "../handlers/loginHandler";
import { guestHandler } from "../handlers/guestHandler";
import { Strategy } from "passport-google-oauth2";
import passport from "passport";

const router = Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.post("/guest", guestHandler);
router.get("/logout", logout);
router.get("/login/failed", loginFailed);
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL_REDIRECT,
    failureRedirect: "/auth/login/failed",
  })
);

export default router;
