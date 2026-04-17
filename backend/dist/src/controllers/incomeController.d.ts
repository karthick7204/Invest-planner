import { Response } from 'express';
import { authRequest } from '../middleware/authentication.js';
export declare const createincome: (req: authRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getIncome: (req: authRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const totalIncome: (req: authRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteIncome: (req: authRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const surplusIncome: (req: authRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=incomeController.d.ts.map