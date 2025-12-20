export function logger(req, res, next) {
    console.log(`${req.method} ${req.originalUrl} ${req.ip}`);
    next();
}
//# sourceMappingURL=log.js.map