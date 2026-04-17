import { Response } from 'express';
import { authRequest } from '../middleware/authentication.js';
export declare const getDailyExpenses: (req: authRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const syncDailyExpenses: (req: authRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getDailyExpenseByDate: (req: authRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=dailyExpenseController.d.ts.map