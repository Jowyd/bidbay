import express from "express";
import { Product, Bid, User } from "../orm/index.js";
import authMiddleware from "../middlewares/auth.js";
import { getDetails } from "../validators/index.js";
import { Request } from "express";
import { ResponseError } from "../types/types.js";
const router = express.Router();

router.get("/api/products", async (req, res) => {
  try{
    const products = await Product.findAll({
      include: [
        { model: Bid, as: "bids" },
        { model: User, as: "seller" },
      ],
    });
    res.status(200).send(products);
  }catch(error: unknown){
    if(error instanceof Error) {
      res.status(500).send({ error: error.message, details: getDetails(error) });
    }else{
      res.status(500).send({ error: "An unknown error occured", details: [] });
    }
  }
});

router.get("/api/products/:productId", async (req:  Request<{ productId: string }, ResponseError | Product, { productId: string }>, res) => {
  try{
    const productId = req.params.productId;
    const product = await Product.findByPk(productId, {
      include: [
        { model: Bid, as: "bids", include: [{ model: User, as: "bidder" }] },
        { model: User, as: "seller" },
      ],
    });
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }
    res.status(200).send(product);
  }catch(error: unknown){
    if(error instanceof Error) {
      res.status(500).send({ error: error.message, details: getDetails(error) });
    }else{
      res.status(500).send({ error: "An unknown error occured", details: [] });
    }
  }
});

// You can use the authMiddleware with req.user.id to authenticate your endpoint ;)

router.post("/api/products", authMiddleware, async (req: Request<Record<string, never>, { error: string; details?: string[] } | Product, { originalPrice: number, name: string, description: string, pictureUrl: string, category: string, endDate: string }>, res) => {
  try{
    const sellerId = req.user?.id;
    if (!sellerId) {
      return res.status(401).send({ error: "Unauthorized" });
    }
    if (
      !req.body.name ||
      !req.body.description ||
      !req.body.originalPrice ||
      !req.body.pictureUrl ||
      !req.body.category
    ) {
      return res
        .status(400)
        .send({
          error: "Invalid or missing fields",
          details: [" name, description, originalPrice, pictureUrl, category are required"],
        });
    }
    let product: Product = new Product(req.body);
    product.sellerId = sellerId;
    await product.save()
    res.status(201).send(product);
  }catch(error: unknown){
    if(error instanceof Error) {
      res.status(500).send({ error: error.message, details: getDetails(error) });
    }else{
      res.status(500).send({ error: "An unknown error occured", details: [] });
    }
  }
});


router.put("/api/products/:productId", authMiddleware, async (req: Request<{ productId: string }, { error: string; details?: string[] } | Product, { productId: string }>, res) => {
  try{
    const authenticatedUserId = req.user?.id;
    const isAdmin = req.user?.admin;
    const product = await Product.findByPk(req.params.productId);
    if (!product) {
      res.status(404).send();
    } else if (product.sellerId !== authenticatedUserId && !isAdmin) {
      res.status(403).send();
    } else {
      await product.update(req.body);
      res.status(200).send(product);
    }
  }catch(error: unknown){
    if(error instanceof Error) {
      res.status(500).send({ error: error.message, details: getDetails(error) });
    }else{
      res.status(500).send({ error: "An unknown error occured", details: [] });
    }
  }
});



router.delete('/api/products/:productId', authMiddleware, async (req: Request<Record<string, never>, ResponseError, { productId:string }>, res) => {
    try{
    const productId = req.params.productId;
    const userId = req.user?.id;
    const product = await Product.findOne({where: {id: productId}, include: [{model: User, as: 'seller'}, {model: Bid, as: 'bids'}]});
    if (!product) {
      return res.status(404).send({ error: 'Product not found', details: [`The product with id ${productId} does not exist`] })
    }
    const canDelete = req.user?.admin || userId === product.sellerId;
    if(!canDelete) {
      return res.status(403).send({error: "You are not allowed to delete this product", details: []})
    }
    for (const bid of product.bids) {
      await bid.destroy();
    }
    await product.destroy();
    return res.status(204).send()
  }catch(error: unknown){
    if(error instanceof Error) {
      res.status(500).send({ error: error.message, details: getDetails(error) });
    }else{
      res.status(500).send({ error: "An unknown error occured", details: [] });
      console.log(error);
    }
  }
})

export default router;