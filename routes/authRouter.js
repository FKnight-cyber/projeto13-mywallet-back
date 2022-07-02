import { Router } from 'express';
import { signIn,signUp } from '../controllers/authController.js';
import registerSchema from '../middlewares/authSchema.js';

const authRouter = Router();

authRouter.post("https://projeto13-mywallet-front-bay.vercel.app/", signIn);
authRouter.post("https://projeto13-mywallet-front-bay.vercel.app/register", registerSchema, signUp);

export default authRouter;