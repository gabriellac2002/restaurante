import express from "express";
import clientRouter from "./clients";
import productRouter from "./products";

const router = express.Router();

router.use("/auth", clientRouter);
router.use("/products", productRouter);

router.get("/", (req, res) => {
  res.send("Hello World!");
});

export default router;
