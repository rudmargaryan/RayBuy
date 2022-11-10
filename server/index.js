import express  from "express";
import config from 'config';
import mongoose from 'mongoose';
import userRouter from './routes/user.js'
import bodyParser from 'body-parser'
const app = express()

const port = config.get('PORT') || 8000

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/user',userRouter)

app.listen(port,async()=>{
    try{
        await mongoose.connect(config.get('MONGODB'),{
            useNewUrlParser: true,
        })
        console.log('Mongo Connected!!')
    }catch(error){
        console.log(error)
    }
    console.log(`Port ${port}`)
})