import { request, response } from 'express';
import jwt from 'jsonwebtoken';
const secretkey = process.env.JWT_SECRET;
const token = request.headers.authorization;
export const tokenauth = async () => {
    if (!token) {
        response.status(500).json({ message: "jwt not found" });
    }
    const decodedToken = jwt.verify(token, secretkey);
};
//# sourceMappingURL=authenticationToken.js.map