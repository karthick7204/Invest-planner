import { request } from 'express';
const secretkey = process.env.JWT_SECRET;
const token = request.headers.authorization;
export const tokenauth = async () => {
};
//# sourceMappingURL=authenticationToken.js.map