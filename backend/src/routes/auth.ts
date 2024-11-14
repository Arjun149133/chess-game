import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    msg: "authentication route",
  });
});

export default router;
