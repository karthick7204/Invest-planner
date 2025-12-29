import { Response } from 'express';
import { authRequest } from '../middleware/authentication.js';
export declare const createExpense: (req: authRequest, res: Response) => Promise<void>;
export declare const getExpenses: (req: authRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const totalExpense: (req: authRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=expenseController.d.ts.map