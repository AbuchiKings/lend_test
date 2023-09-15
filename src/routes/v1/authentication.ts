import {Router} from 'express'
import UserController from "../../controllers/userController";
import { validateCreateUser, validateLogin, validationHandler } from "../../middlewares/validator";
import { verifyToken } from '../../middlewares/auth';

const router = Router();

router.post('/signup', validateCreateUser, validationHandler, UserController.login);

router.post('/login', validateLogin, validationHandler, UserController.login);

router.get('/test', verifyToken, UserController.test);

export default router;

