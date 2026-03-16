import { displayStocks } from "../controllers/displayStocksController.js";
import { Router } from "express";
import { verifyToken } from "../middleware/authentication.js";
export const stocksRouter = Router();
stocksRouter.get("/displaystocks", verifyToken, displayStocks);
//# sourceMappingURL=stocksRoute.js.map