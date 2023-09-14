import db from "../db/index";
import { TransactionInterface } from '../utils/interfaces/interface'

type newTransaction = {
    userId: number;
    balance: string;
    amount: string;
    from?: string;
    to?: string;
    txnType?: string;
    external?: boolean;
    createdAt?: Date;
}

export async function create(record: newTransaction): Promise<number[] | undefined> {
    const data = await db('transaction').insert(record);
    return data;
}

export async function findFieldsById(id: number, fields: string | string[]  = '*'): Promise<TransactionInterface | undefined> {
    const data = await db<TransactionInterface>('transaction').select(fields).where('id', id).first()
    return data;
}

