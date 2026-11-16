import { Router } from 'express';
import { login, createuser, updateusername, deleteusername, googleAuth, } from '../controllers/userController.js';
export const router = Router();
router.post('/login', login);
router.post('/register', createuser);
router.post('/google-auth', googleAuth);
router.put('/updateusername/:id', updateusername);
router.delete('/deleteusername/:id', deleteusername);
//# sourceMappingURL=login.js.map