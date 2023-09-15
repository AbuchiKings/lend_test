import db from "../db/index";
import { WalletInterface } from '../utils/interfaces/interface'

type newWallet = {
    userId: number
}

export async function createWallet(wallet: newWallet): Promise<number[] | undefined> {
    const data = await db('wallet').insert(wallet);
    return data;
}

export async function findWalletFieldsByUserId(userId: number, fields: string | string[] = '*'): Promise<WalletInterface | undefined> {
    const data = await db<WalletInterface>('wallet').select(fields).where('userId', userId).first()
    return data;
}

export async function deleteWallet(userId: number) {
    const data = await db('wallet').where('userId', userId).del()
    return data;
}

