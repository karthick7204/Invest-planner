import { Request, Response } from 'express';
export declare const createuser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateusername: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteusername: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Handle Google OAuth Sign In / Sign Up
 * Verifies Google ID Token via Google tokeninfo API, finds or creates user,
 * and signs an application JWT session.
 */
export declare const googleAuth: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=userController.d.ts.map