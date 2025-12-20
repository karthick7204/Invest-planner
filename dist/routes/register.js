import { Router } from 'express';
import { createuser } from '../controllers/userController.js';
export const router = Router();
router.post('/register', createuser);
//# sourceMappingURL=register.js.map