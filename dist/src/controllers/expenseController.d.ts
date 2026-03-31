import { Response } from 'express';
import { authRequest } from '../middleware/authentication.js';
export declare const createExpense: (req: authRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getExpenses: (req: authRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const totalExpense: (req: authRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getExpenseCategoryData: (req: authRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getTransactions: (req: authRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getGraphData: (req: authRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getCategoryBreakdown: (req: authRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteTransaction: (req: authRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAIAnalysis: (req: authRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=expenseController.d.ts.map