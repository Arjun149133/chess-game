import { Router } from "express";
import { registerHandler } from "../handlers/registerHandler";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    msg: "authentication route",
  });
});

router.post("/register", registerHandler);

export default router;
