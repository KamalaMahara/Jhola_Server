import { Router } from 'express'
import { AuthController } from '../Database/Models/controller/userController.js';

const router: Router = Router();
const authController = new AuthController();

router.post('/register', authController.registerUser)

export default router