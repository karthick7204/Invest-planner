import { Request, Response } from 'express';
export declare const createuser: (req: Request, res: Response) => Promise<void>;
export declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateusername: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteusername: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=userController.d.ts.map