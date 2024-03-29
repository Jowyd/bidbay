import express from 'express'
import { User, Product, Bid } from '../orm/index.js'
import authMiddleware from '../middlewares/auth.js'

const router = express.Router()

router.get("/api/users/me", authMiddleware, async (req, res) => {
  const userId = req.user?.id;
  const user = await User.findByPk(userId, {
    include: [
      { model:Product, isAliased: true, as: 'products' }, 
      { model:Bid, isAliased: true, as: 'bids', include: [{model:Product, isAliased: true, as: 'product'}] }
    ]
  })
  if(!user) {
    return res.status(404).send({message: "User not found"});
  }
  return res.status(200).send(user);
})


router.get('/api/users/:userId', async (req, res) => {
  if(!req.params.userId) {
    return res.status(400).send({message: "userId is required"});
  }
  const userId = req.params.userId;

  const user = await User.findByPk(userId, {
    include: [
      { model:Product, isAliased: true, as: 'products' }, 
      { model:Bid, isAliased: true, as: 'bids', include: [{model:Product, isAliased: true, as: 'product'}] }
    ]
  })
  if(!user) {
    return res.status(404).send({message: "User not found"});
  }
  return res.status(200).send(user);
})

export default router
