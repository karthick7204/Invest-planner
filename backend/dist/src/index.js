import express from 'express';
import { router } from './routes/login.js';
import { expenserouter } from './routes/expenseroute.js';
import { investRouter } from './routes/investRoute.js';
import { requestHandler } from './middleware/app.js';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { savingsroute } from './routes/savingsroute.js';
import { stocksRouter } from './routes/stocksRoute.js';
import { dailyExpenseRouter } from './routes/dailyExpenseRoute.js';
import { budgetRouter } from './routes/budgetRoute.js';
import aiRouter from './routes/aiRoutes.js';
import cors from "cors";
const app = express();
app.use(bodyParser.json());
dotenv.config();
const port = process.env.PORT || 3000;
const MONGOURL = process.env.MONGO_URL || " ";
app.use(cors());
app.use(requestHandler);
app.use('/api', router);
app.use('/expense', expenserouter);
app.use('/invest', investRouter);
app.use('/target', savingsroute);
app.use('/stocks', stocksRouter);
app.use('/dailyexpense', dailyExpenseRouter);
app.use('/budget', budgetRouter);
app.use('/ai', aiRouter);
mongoose.connect(MONGOURL, {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    socketTimeoutMS: 45000,
}).then(() => {
    console.log("✅ MongoDB Atlas Connected Successfully");
}).catch((error) => {
    console.error("❌ MongoDB Connection Error:", error.message);
});
mongoose.connection.on('error', err => {
    console.error('Mongoose heart-beat error:', err);
});
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});
app.listen(port, () => {
    console.log(`this is the port that is listening ${port}`);
    console.log(`mongoulr = ${MONGOURL}`);
});
//# sourceMappingURL=index.js.map