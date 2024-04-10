import express from 'express'
import { User, Product, Bid } from '../orm/index.js'
import authMiddleware from '../middlewares/auth.js'
import { ResponseError } from '../types/types.js'
import { Request } from "express";
import { getDetails } from '../validators/index.js';

const router = express.Router()

router.get("/api/users/me", authMiddleware, async (req: Request<Record<string, never>, ResponseError | User, Record<string, never>>, res) => {
  try{
    const userId = req.user?.id;
    const user = await User.findByPk(userId, {
      include: [
        { model:Product, isAliased: true, as: 'products' }, 
        { model:Bid, isAliased: true, as: 'bids', include: [{model:Product, isAliased: true, as: 'product'}] }
      ]
    })
    if(!user) {
      return res.status(404).send({error: "User not found"});
    }
    return res.status(200).send(user);
  }catch(error: unknown){
    if(error instanceof Error) {
      res.status(500).send({ error: error.message, details: getDetails(error) });
    }else{
      res.status(500).send({ error: "An unknown error occured", details: [] });
    }
  }
})


router.get('/api/users/:userId', async (req: Request<{ userId: string }, ResponseError | User, Record<string, never>>, res) => {
  try{
    if(!req.params.userId) {
      return res.status(400).send({error: "userId is required"});
    }
    const userId = req.params.userId;
  
    const user = await User.findByPk(userId, {
      include: [
        { model:Product, isAliased: true, as: 'products' }, 
        { model:Bid, isAliased: true, as: 'bids', include: [{model:Product, isAliased: true, as: 'product'}] }
      ]
    })
    if(!user) {
      return res.status(404).send({error: "User not found"});
    }
    return res.status(200).send(user);
  }catch(error: unknown){
    if(error instanceof Error) {
      res.status(500).send({ error: error.message, details: getDetails(error) });
    }else{
      res.status(500).send({ error: "An unknown error occured", details: [] });
    }
  }
})

export default router
