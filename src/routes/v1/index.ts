import { Router, Request, Response, NextFunction } from 'express';
import { NoEntryError } from '../../utils/requestUtils/ApiError';
import { SuccessMsgResponse } from '../../utils/requestUtils/ApiResponse';
import authentication from './authentication'
import transaction from './transaction'

const router = Router();
const version = '/api/v1'

router.use(`${version}/auth`, authentication);
router.use(`${version}/transaction`, transaction);

router.get('/', (req: Request, res: Response) => {
    return new SuccessMsgResponse('Welcome.').send(res);
});

router.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new NoEntryError(`Could not find ${req.originalUrl} on this server.`));
});

export default router;
