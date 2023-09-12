import { Router, Request, Response, NextFunction } from 'express';
import { NoEntryError } from '../../utils/requestUtils/ApiError';
import { SuccessMsgResponse } from '../../utils/requestUtils/ApiResponse';



const router = Router();


router.get('/', (req: Request, res: Response) => {
    return new SuccessMsgResponse('Welcome.').send(res);
});

router.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new NoEntryError());
});

export default router;
