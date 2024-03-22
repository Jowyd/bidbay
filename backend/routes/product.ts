import express from "express";
import { Product, Bid, User } from "../orm/index.js";
import authMiddleware from "../middlewares/auth.js";
import { getDetails } from "../validators/index.js";
import { isSet } from "util/types";

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
    res.status(200).send(product);
  }
});

// You can use the authMiddleware with req.user.id to authenticate your endpoint ;)

router.post("/api/products", authMiddleware, (req, res) => {
  const { name, description, category, originalPrice, pictureUrl, endDate } =
    req.body;
  const authenticatedUserId = req.user?.id;

  Product.create({
    name,
    description,
    category,
    originalPrice,
    pictureUrl,
    endDate,
    sellerId: authenticatedUserId,
  })
    .then((product) => {
      res.status(201).send(product);
    })
    .catch((error) => {
      return res.status(400).json({
        error: "Invalid or missing fields",
        details: getDetails(error as Error),
      });
    });
});

router.put("/api/products/:productId", async (req, res) => {});

router.delete("/api/products/:productId", async (req, res) => {
  res.status(600).send();
});

export default router;
