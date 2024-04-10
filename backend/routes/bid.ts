import authMiddleware from '../middlewares/auth'
import { Bid, Product } from '../orm/index.js'
import express, {Request} from 'express'
import { getDetails } from '../validators/index.js'
import { ResponseError } from '../types/types'

const router = express.Router()

router.delete('/api/bids/:bidId', authMiddleware, async (req: Request<{ bidId: string }, ResponseError, Record<string, never>>, res) => {
  try{
    const isAdmin = req.user?.admin
    if(isAdmin) {
      const result = await Bid.destroy({ where: { id: req.params.bidId } })
      if (result === 0) {
        return res.status(404).send({ error: 'Bid not found' })
      }
      return res.status(204).send()
    }else{
      const result = await Bid.destroy({ where: { id: req.params.bidId, bidderId: req.user?.id } })
      if (result === 0) {
        return res.status(403).send({ error: 'You are not allowed to delete this bid' })
      }
      return res.status(204).send()
    }
  }catch(error: unknown){
    if(error instanceof Error) {
      res.status(500).send({ error: error.message, details: getDetails(error) });
    }else{
      res.status(500).send({ error: "An unknown error occured" });
    }
  }
})

router.post('/api/products/:productId/bids', authMiddleware, async (req: Request<{ productId: string}, ResponseError | Bid, Record<string,never>>, res) => {
  try{
    const productId = req.params.productId
    const userId = req.user?.id
    const { price } = req.body;
    const product = await Product.findByPk(productId)
    if (!product) {
      return res.status(404).send({ error: 'Product not found', details: [] })
    }
    if(!price) {
      return res.status(400).send({ error: 'Invalid or missing fields', details: ["Price is required"] })
    }
    const bid = await Bid.create({ price:price, productId:productId, bidderId: userId, date: new Date()})
    return res.status(201).send(bid)
  }catch(error: unknown){
    if(error instanceof Error) {
      res.status(500).send({ error: error.message, details: getDetails(error) });
    }else{
      res.status(500).send({ error: "An unknown error occured" });
    }
  }
})


export default router
