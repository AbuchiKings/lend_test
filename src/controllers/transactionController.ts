import { NextFunction, Response } from "express";

import db from '../db'
import { findUserByEmail } from "../services/userRepo"

import { ProtectedRequest } from "../utils/interfaces/interface";
import { BadRequestError, InternalError, NotFoundError } from "../utils/requestUtils/ApiError";
import { SuccessResponse } from "../utils/requestUtils/ApiResponse";

class TransactionController {
    public static fund = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
        const { amount } = req.body;
        let id = req.user!.id
        let trx;
        try {
            trx = await db.transaction();
            const wallet = await trx('wallet').where('userId', id).forUpdate().select('balance').first();
            if (!wallet) throw new NotFoundError('Wallet not found.');
            let data = await trx('wallet').where('id', id).increment({ balance: amount });
            if (!data) throw new InternalError()
            await trx.commit();
            let balance = Number(wallet.balance) + Number(amount)
            return new SuccessResponse(`Wallet was successfully funded`, { balance }, 1).send(res);
        } catch (error) {
            if (trx) {
                await trx.rollback();
            }
            return next(error)
        }
    }

    public static transferFunds = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
        let trx;
        try {
            let { amount, recipientEmail } = req.body;
            let id = req.user!.id
            amount = Number(amount);

            const recipient = await findUserByEmail(recipientEmail, 'id');
            if (!recipient) throw new NotFoundError('Recipient not found.')

            trx = await db.transaction(); // Start a transaction
            const sourceWallet = await trx('wallet').where('id', id).forUpdate().select('balance').first();
            const walletBalance = Number(sourceWallet.balance);

            if (!sourceWallet) throw new NotFoundError('Source wallet not found');
            if (walletBalance < amount) throw new BadRequestError('Insufficient funds');

            const destinationWallet = await trx('wallet').where('id', recipient.id).forUpdate()
                .select('balance').first();

            if (!destinationWallet) throw new NotFoundError('Destination wallet not found');

            // Update the source wallet's balance
            await trx('wallet').where('id', id).decrement('balance', amount);

            // Update the destination wallet's balance
            await trx('wallet').where('id', recipient.id).increment('balance', amount).update('updatedAt', new Date());

            await trx.commit();
            let data = { balance: (walletBalance - amount).toFixed(2) }

            return new SuccessResponse('Transaction successful', data, 1).send(res)
        } catch (error) {
            if (trx) {
                await trx.rollback();
            }
            return next(error)
        }

    }

    public static withdraw = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
        let { amount } = req.body;
        amount = Number(amount);
        let id = req.user!.id
        let trx;
        try {
            trx = await db.transaction();
            const wallet = await trx('wallet').where('userId', id).forUpdate().select('balance').first();
            const walletBalance = Number(wallet.balance);

            if (!wallet) throw new NotFoundError('Wallet not found.');
            if (walletBalance < amount) throw new BadRequestError('Insufficient funds');

            let data = await trx('wallet').where('id', id).decrement({ balance: amount });
            if (!data) throw new InternalError();

            //queue transfer to bank

            await trx.commit();

            let result = { balance: (walletBalance - amount).toFixed(2) }
            return new SuccessResponse(`Wallet was successfully funded`, result, 1).send(res);
        } catch (error) {
            if (trx) {
                await trx.rollback();
            }
            return next(error)
        }

    }
}

export default TransactionController;
