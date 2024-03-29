import express from 'express'
import { User, Product, Bid } from '../orm/index.js'
import authMiddleware from '../middlewares/auth.js'

const router = express.Router()

const userInDbMiddleware = async (req, res, next) => {
  const userId = req.params.userId;
  const user = await User.findByPk(userId)
  if (!user) {
    return res.status(404).send("User not found")
  }
  req.user = user
  next()
}

router.get("/api/users/me", authMiddleware, async (req, res) => {
  const userId = req.user?.id;
  console.log("userId", userId);
  const user = await User.findByPk(userId, {
    include: [Product, Bid]
  })
  return res.status(200).send(user);
})

router.get("/api/users/:userId/products", userInDbMiddleware, async (req, res) => {
  const userId = req.params.userId;
  const products = await Product.findAll({
    where: {
      sellerId: userId
    }
  })
  return res.status(200).send(products);
})

router.get("/api/users/:userId/bids", userInDbMiddleware, async (req, res) => {
  const userId = req.params.userId;
  const bids = await Bid.findAll({
    where: {
      bidderId: userId
    }
    ,include: [Product]
  })
  return res.status(200).send(bids);
})


router.get('/api/users/:userId', userInDbMiddleware, async (req, res) => {
  const userId = req.params.userId    
  const user = await User.findByPk(userId, {
    include: [Product, Bid]
  })
  return res.status(200).send(user);
})

export default router
