import crypto from "crypto";

import _ from "lodash";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from 'express';

import { AuthFailureError, ConflictError, InternalError } from "../utils/requestUtils/ApiError";
import { SuccessResponse, } from '../utils/requestUtils/ApiResponse';
import * as User from "../services/userRepo"

import { createToken } from "../middlewares/auth";
import { createWallet } from "../services/walletRepo";
import { setJson } from "../cache/query";
import { ProtectedRequest, UserInterface } from "utils/interfaces/interface";

class UserController {
    public static login = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { email, password, firstname } = req.body;
            let login;
            if (req.url === '/signup') {
                const passwordHash = await bcrypt.hash(password, 12);
                const ret = await User.createUser({ email, password: passwordHash, firstname });

                if (ret) {
                    login = await User.findUserByEmail(email);
                }
                if (!login) throw new InternalError();

                await createWallet({ userId: login.id }); // This should preferrably be in a job
            } else {
                login = await User.findUserByEmail(email);
                if (!login) throw new AuthFailureError('Incorrect email or password.');

                const match = await bcrypt.compare(password, login.password!);
                if (!match) throw new AuthFailureError('Incorrect email or password.');
            }
            const accessTokenKey = crypto.randomBytes(64).toString('hex');

            const token = await createToken(login, accessTokenKey);
            const data = getUserData(login);

            await setJson(`${data.id}:${accessTokenKey}`, data, 75 * 3600)
            return new SuccessResponse('User successfully logged in.', { ...data, token }, 1).send(res);
        } catch (error: any) {
            if (error.code === 'ER_DUP_ENTRY') {
                error = new ConflictError('User with email already exists');
            }
            return next(error)
        }
    }

    public static test = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
        return new SuccessResponse('Test success.', null, 1).send(res);
    }
}

function getUserData(user: UserInterface) {
    const data = _.omit(user, ['password']);
    return data;
}

export default UserController;