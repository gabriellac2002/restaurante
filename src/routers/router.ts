import express from "express";
import clientRouter from "./clients";
import productRouter from "./products";
import orderRouter from "./orders";

var cors = require("cors");

const router = express.Router();
router.use(cors());

router.use("/auth", clientRouter);
router.use("/products", productRouter);
router.use("/order", orderRouter);

router.get("/", (req, res) => {
  res.send("Hello World!");
});

export default router;
