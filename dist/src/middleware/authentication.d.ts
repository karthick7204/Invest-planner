import { Request, Response, NextFunction } from 'express';
export interface authRequest extends Request {
    userId?: string;
}
export declare const verifyToken: (req: authRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=authentication.d.ts.map