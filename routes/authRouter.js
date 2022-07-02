import { Router } from 'express';
import { signIn,signUp } from '../controllers/authController.js';
import registerSchema from '../middlewares/authSchema.js';

const authRouter = Router();

authRouter.post("/", signIn);
authRouter.post("/register", registerSchema, signUp);

export default authRouter;