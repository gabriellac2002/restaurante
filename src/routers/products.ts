import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", async (req: Request, res: Response) => {
  const { name, price, description, imageUrl, category } = req.body;

  if (!name || !price || !description || !category) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (price <= 0) {
    return res.status(400).json({ error: "Price must be a positive number" });
  }

  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        price,
        description,
        image: imageUrl || null,
        category,
      },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: id },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price, description, imageUrl, category } = req.body;

  const updateData: any = {};
  if (name) updateData.name = name;
  if (price) {
    if (price <= 0) {
      return res.status(400).json({ error: "Price must be a positive number" });
    }
    updateData.price = price;
  }
  if (description) updateData.description = description;
  if (imageUrl) updateData.image = imageUrl;
  if (category) updateData.category = category;

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: updateData,
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    if ((error as any).code === "P2025") {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(500).json({ error: "Failed to update product" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedProduct = await prisma.product.delete({
      where: { id: id },
    });

    res.status(200).json(deletedProduct);
  } catch (error) {
    if ((error as any).code === "P2025") {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
