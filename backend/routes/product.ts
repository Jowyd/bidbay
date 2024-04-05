import express from 'express'
import { Product, Bid, User } from '../orm/index.js'
import authMiddleware from '../middlewares/auth.js'
import { getDetails } from '../validators/index.js'
import { Request } from 'express';

const router = express.Router()

router.get('/api/products', async (req, res, next) => {
  const products = await Product.findAll({include: [{model: Bid, as: 'bids'}, {model: User, as: 'seller'}]})
  res.status(200).send(products)
})

router.get('/api/products/:productId', async (req: Request<{productId:string}>, res) => {
  const productId = req.params.productId
  const product = await Product.findByPk(productId, {include: [{model: Bid, as: 'bids', include: [{model: User, as: "bidder"}]}, {model: User, as: 'seller'}]})
  if (!product) {
    return res.status(404).send({ error: 'Product not found' })
  }
  console.log(product)
  res.status(200).send(product)
})

// You can use the authMiddleware with req.user.id to authenticate your endpoint ;)

router.post('/api/products', authMiddleware, (req, res) => {
  const sellerId  = req.user?.id
  if(!sellerId ) {
    return res.status(401).send({ error: "Unauthorized"})
  }
  req.body.sellerId = sellerId;
  if(!req.body.name || !req.body.description || !req.body.originalPrice || !req.body.pictureUrl || !req.body.category) {
    return res.status(400).send({error: "Invalid or missing fields", details: getDetails(req.body)})
  }
  Product.create(req.body)
    .then((product) => res.status(201).send(product))
    .catch((error) => res.status(500).send({ message: error.message, details: getDetails(error) }))
})

router.put('/api/products/:productId', authMiddleware, async (req, res) => {
  const productId = req.params.productId
  const userId = req.user?.id
  if(!userId) {
    return res.status(401).send({error: "Unauthorized"})
  }
  const { name, description, originalPrice, pictureUrl, category } = req.body
  const product = await Product.findByPk(productId, {include: [{model: User, as: 'seller'}, {model: Bid, as: 'bids'}]})
  if (!product) {
    return res.status(404).send({ error: 'Product not found', details: getDetails(req.body) })
  }
  const canUpdate = req.user?.admin || req.user?.id === userId;
  if(!canUpdate) {
    return res.status(403).send({error: "You are not allowed to update this product"})
  }
  product.name = name
  product.description = description
  product.originalPrice = originalPrice
  product.pictureUrl = pictureUrl
  product.category = category
  product.save()
  .catch((error) => res.status(500).send({ error: error.message, details: getDetails(error) }))
  .then(() => res.status(200).send(product))
})

router.delete('/api/products/:productId', authMiddleware, async (req, res) => {
  try{
    const productId = req.params.productId;
    const userId = req.user?.id;
    const product = await Product.findOne({where: {id: productId}, include: [{model: User, as: 'seller'}, {model: Bid, as: 'bids'}]})
    if (!product) {
      return res.status(404).send({ error: 'Product not found', details: getDetails(req.body) })
    }
    const canDelete = req.user?.admin || req.user?.id === product.sellerId;
    if(!canDelete) {
      return res.status(403).send({error: "You are not allowed to delete this product"})
    }
    for (const bid of product.bids) {
      await bid.destroy();
    }
    await product.destroy();
    return res.status(204).send()
  }catch(error) {
    // console.log(error)
  }
})

export default router
