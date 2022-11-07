import express  from "express";
import config from 'config'
const app = express()

const port = config.get('PORT') || 8000


app.listen(port,()=>{
    console.log('Server has been start')
    console.log(`Port ${port}`)
})