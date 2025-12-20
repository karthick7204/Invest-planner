import { Router } from 'express';
export const router = Router();
router.get("/", (req, res) => {
    res.send({
        message: 'get all the calculations',
        data: [
            { id: 1, result: 1 },
            { id: 2, result: 2 },
        ],
    });
});
router.get("/:id", (req, res) => {
    res.send({
        message: 'get calculation by id',
        id: req.params.id,
        result: 1,
    });
});
//# sourceMappingURL=calculator.js.map