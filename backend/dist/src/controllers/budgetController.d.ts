import { Response } from 'express';
import { authRequest } from '../middleware/authentication.js';
export declare const setBudget: (req: authRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getBudgets: (req: authRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteBudget: (req: authRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=budgetController.d.ts.map