import express from 'express'
import { User, Product, Bid } from '../orm/index.js'

const router = express.Router()

router.get('/api/users/:userId', async (req, res) => {
  const userId = req.params.userId
  const user = await User.findByPk(req.params.userId)
  const products = await Product.findAll({
    where: {
      sellerId: userId
      }
      });
  const bids  = await Bid.findAll({
    where: {
      bidderId: userId
      },
    include: Product
      });
  res.send({user, products, bids});
})

router.get("/api/users/:userId/products", async (req, res) => {
  const result = await Product.findAll({
    where: {
      userId: req.params.userId
    }
  })
  res.send(result);
})

export default router
