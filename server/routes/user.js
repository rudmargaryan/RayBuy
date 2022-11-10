import express from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import config from 'config';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router();
function generateAccessToken(username) {
    return jwt.sign({name:username}, config.get('JWT_TOKEN'), { expiresIn: '1d' });
}

router.post(
  "/signup",
  body('name').isLength({min:4,max:20}),
  body('password').isLength({min:8,max:20}),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        const {name,password} = req.body
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password,salt)
        const isHaveAnyUser = await User.findOne({name})
        if(isHaveAnyUser){
            return res.status(400).send({error: 'User is already registered!'})
        }
      const newUser = new User({
        name: name,
        password: hash
      });
      await newUser.save((err) => {
        return res.status(400).send(err)
      });
      return res.status(200).send(newUser);
    } catch (error) {
      return res.status(500).send({error});
    }
  }
);

router.post('/signin',
    body('name').not().isEmpty().withMessage('Pleas fill required filds.'),
    body('password').not().isEmpty().withMessage('Pleas fill required filds.'),
    async (req,res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        try{
            const {name,password} = req.body
            const find = await User.findOne({name})
            if(!find){
                return res.status(400).send({error: 'User not found'})
            }
            const compare = await bcrypt.compare(password,find.password)
            if(!compare){
                return res.status(400).send({error: 'Password dosnt match.'})
            }
            const toSend = await User.findOne({name}).select('-password -_id -__v')
            return res.status(200).send({
                user: toSend,
                token: generateAccessToken(toSend.name)
            })
        }catch (error) {
            return res.status(500).send({error});
        }
    }
)

router.get('/auth', async(req,res)=>{
    try{
        const token = req.headers.authorization.split(' ')[1]
        const {name} = jwt.verify(token,config.get('JWT_TOKEN',(err)=>{
            return res.status(400)
        }))
        const user = await User.findOne({name}).select('-password -_id -__v')
        if(!user){
            return res.status(404).send({error: "User not found."})
        }
        return res.status(200).send(user)
    }catch (error) {
        return res.status(500).send({error});
    }
})

export default router;
