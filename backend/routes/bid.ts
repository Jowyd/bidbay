import authMiddleware from '../middlewares/auth'
import { Bid, Product } from '../orm/index.js'
import express from 'express'
import { getDetails } from '../validators/index.js'

const router = express.Router()

router.delete('/api/bids/:bidId', authMiddleware, async (req, res) => {
  const isAdmin = req.user?.admin
  if(isAdmin) {
    const result = await Bid.destroy({ where: { id: req.params.bidId } })
    if (result === 0) {
      return res.status(404).send({ error: 'Bid not found', details: getDetails(req.body) })
    }
    return res.status(204).send()
  }else{
    const result = await Bid.destroy({ where: { id: req.params.bidId, bidderId: req.user?.id } })
    if (result === 0) {
      return res.status(403).send({ error: 'You are not allowed to delete this bid', details: getDetails(req.body) })
    }
    return res.status(204).send()
  }
})

router.post('/api/products/:productId/bids', authMiddleware, async (req, res) => {
  const productId = req.params.productId
  const userId = req.user?.id
  const { price } = req.body;
  const product = await Product.findByPk(productId)
  if (!product) {
    return res.status(404).send({ error: 'Product not found', details: getDetails(req.body) })
  }
  if(!price) {
    return res.status(400).send({ error: 'Invalid or missing fields', details: getDetails(req.body) })
  }
  const bid = await Bid.create({ price:price, productId:productId, bidderId: userId, date: new Date()})
  .then((bid) => res.status(201).send(bid))
  .catch((error) => res.status(500).send({ message: error.message, details: getDetails(error) }))
})


export default router
