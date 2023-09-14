import { Router } from 'express'

import TransactionController from "../../controllers/transactionController";

import { validateFundWallet, validateTransfer, validationHandler } from "../../middlewares/validator";
import { verifyToken } from "../../middlewares/auth";

const router = Router();
router.use(verifyToken)

router.post('/fund', validateFundWallet, validationHandler, TransactionController.fund);

router.post('/transfer', validateTransfer, validationHandler, TransactionController.transferFunds);

router.post('/withdraw', validateFundWallet, validationHandler, TransactionController.withdraw);

export default router;

