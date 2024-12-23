import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", async (req: Request, res: Response): Promise<any> => {
  const { name, price, description, category } = req.body;
  console.log(req.files);

  if (!name || !price || !description || !category) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice) || parsedPrice <= 0) {
    return res.status(400).json({ error: "Price must be a positive number" });
  }

  try {
    let image = null;
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      image = req.files[0].filename;
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        price: parsedPrice,
        description,
        image,
        category,
      },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.log(error);
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

router.get("/:id", async (req: Request, res: Response): Promise<any> => {
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

router.put("/:id", async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  console.log(req.body);
  const { name, price, description, category } = req.body;

  const updateData: any = {};
  if (name) updateData.name = name;
  if (price) {
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ error: "Price must be a positive number" });
    }
    updateData.price = parsedPrice;
  }
  if (description) updateData.description = description;

  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const file = req.files[0];
    updateData.image = file.filename;
  }

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
    console.log(error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

router.delete("/:id", async (req: Request, res: Response): Promise<any> => {
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
