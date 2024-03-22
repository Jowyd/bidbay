import express from "express";
import { Product, Bid, User } from "../orm/index.js";
import authMiddleware from "../middlewares/auth.js";
import { getDetails } from "../validators/index.js";

const router = express.Router();

router.get("/api/products", async (req, res, next) => {
  const products = await Product.findAll({ include: [Bid, User] });
  res.json(products);
  if (!products) {
    res.status(404).send();
  }
});

router.get("/api/products/:productId", async (req, res) => {
    const product = await Product.findByPk(req.params.productId, {
      include: [Bid, User],
    });
    if (!product) {
      res.status(404).send();
    } else {
      res.json(product);
    }
});

// You can use the authMiddleware with req.user.id to authenticate your endpoint ;)

router.post("/api/products", (req, res) => {
});

router.put("/api/products/:productId", async (req, res) => {
  res.status(600).send();
});

router.delete("/api/products/:productId", async (req, res) => {
  res.status(600).send();
});

export default router;
