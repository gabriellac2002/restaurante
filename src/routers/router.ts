import express from "express";
import clientRouter from "./clients";

const router = express.Router();

router.use("/auth", clientRouter);

router.get("/", (req, res) => {
  res.send("Hello World!");
});

export default router;
