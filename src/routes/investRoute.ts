import {Router} from 'express'
import { verifyToken } from '../middleware/authentication.js';
import { investsplit } from '../controllers/investSplit.js';

export const investRouter = Router();

investRouter.get('/investsplit',verifyToken,investsplit);

