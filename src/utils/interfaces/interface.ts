import { Router, Request } from 'express';

export interface UserInterface {
    id: number;
    firstname?: string;
    password?: string
    email?: string
    createdAt?: Date;
}
export interface wallet {
    userId: number;
    id: number;
    balance?: string;
    createdAt?: Date;
}

export interface ProtectedRequest extends Request {
    user?: UserInterface;
    accessToken?: string;
}