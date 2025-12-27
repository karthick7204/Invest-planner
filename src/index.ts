import express from 'express'
import { router } from './routes/login.js';
import { expenserouter } from './routes/expenseroute.js';

import { requestHandler } from './middleware/app.js';
import bodyParser from 'body-parser';
import  dotenv  from 'dotenv';
import mongoose from 'mongoose';

const app = express();
app.use(bodyParser.json())
dotenv.config()
const port = process.env.PORT || 3000
const MONGOURL : string   = process.env.MONGO_URL || " "

app.use(requestHandler)
app.use('/api',router) 

app.use('/expense',expenserouter) 


mongoose.connect(MONGOURL).then(()=>{
    console.log("mongodb connection successfull")
}).catch((error)=>{
    console.log(`this is the ${error}`)
})

app.listen(port,()=>{
    console.log(`this is the port that is listening ${port}`)
    console.log(`mongoulr = ${MONGOURL}`)
})