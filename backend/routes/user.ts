import express from 'express'
import { User, Product, Bid } from '../orm/index.js'

const router = express.Router()

router.get('/api/users/:userId', async (req, res) => {
  const userId = req.params.userId
  const user = await User.findByPk(userId, {
    include: [Product, Bid]
  })
  res.status(200).send(user);
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
