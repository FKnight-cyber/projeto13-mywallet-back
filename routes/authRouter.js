import { Router } from 'express';
import { signIn,signUp } from '../controllers/authController.js';
import registerSchema from '../middlewares/authSchema.js';

const authRouter = Router();

authRouter.post("https://ryan-projeto13-mywallet.herokuapp.com/", signIn);
authRouter.post("https://ryan-projeto13-mywallet.herokuapp.com/register", registerSchema, signUp);

export default authRouter;