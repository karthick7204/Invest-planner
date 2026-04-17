import jwt from "jsonwebtoken";
export const verifyToken = async (req, res, next) => {
    let authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "token is missing" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "token is missing" });
    }
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: "JWT secret not configured" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "invalid token" });
    }
};
//# sourceMappingURL=authentication.js.map