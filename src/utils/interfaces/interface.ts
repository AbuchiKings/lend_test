import { Router, Request } from 'express';

export interface UserInterface {
    id: number;
    firstname?: string;
    password?: string
    email?: string
    createdAt?: Date;
}
export interface WalletInterface {
    userId: number;
    id: number;
    balance?: string;
    createdAt?: Date;
    updatedAt?: Date;
    currency?: Date;
}
enum txnType {
    CR = 'CR',
    DR = 'DR',
}
export interface TransactionInterface {
    userId: number;
    id: number;
    type: string;
    balance: string;
    amount: string;
    from?: string;
    to?: string;
    txnType?: txnType;
    external?: boolean;
    createdAt?: Date;
}

export interface ProtectedRequest extends Request {
    user?: UserInterface;
    accessToken?: string;
}