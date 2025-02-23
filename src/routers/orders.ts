import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", async (req: Request, res: Response): Promise<any> => {
  const { userId, products } = req.body;

  if (
    !userId ||
    !products ||
    !Array.isArray(products) ||
    products.length === 0
  ) {
    return res.status(400).json({ error: "User ID and products are required" });
  }

  try {
    let totalPrice = 0;
    const productIds = products.map((product: any) => product.productId);
    const availableProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (availableProducts.length !== products.length) {
      return res.status(400).json({ error: "Some products are not available" });
    }

    const orderItems = products.map((product: any) => {
      const availableProduct = availableProducts.find(
        (p) => p.id === product.productId
      );
      if (!availableProduct) {
        throw new Error(`Product with ID ${product.productId} not found`);
      }
      totalPrice += availableProduct.price * product.quantity;
      return {
        productId: product.productId,
        quantity: product.quantity,
      };
    });

    const newOrder = await prisma.order.create({
      data: {
        userId,
        totalPrice,
        status: "pending",
      },
    });

    const orderItemsData = orderItems.map((item: any) => ({
      orderId: newOrder.id,
      productId: item.productId,
      quantity: item.quantity,
    }));

    await prisma.orderItem.createMany({
      data: orderItemsData,
    });

    res.status(201).json({ orderId: newOrder.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const ordersDetails = orders.map((order) => ({
      id: order.id,
      userId: order.userId,
      userName: order.user.name,
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
      products: order.items.map((item) => ({
        productId: item.productId,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
    }));

    res.status(200).json(ordersDetails);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    const order = await prisma.order.findUnique({
      where: { id: id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const orderDetails = {
      id: order.id,
      userId: order.userId,
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
      products: order.items.map((item) => ({
        productId: item.productId,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
    };

    res.status(200).json(orderDetails);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

export default router;
