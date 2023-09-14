import db from "../db/index";
import { WalletInterface } from '../utils/interfaces/interface'

type newWallet = {
    userId: number
}

export async function createWallet(wallet: newWallet): Promise<number[] | undefined> {
    const data = await db('wallet').insert(wallet);
    return data;
}

export async function findWalletFieldsById(id: number, fields: string | string[] = '*'): Promise<WalletInterface | undefined> {
    const data = await db<WalletInterface>('wallet').select(fields).where('id', id).first()
    return data;
}

export async function deleteWallet(id: number) {
    const data = await db('wallet').where('id', id).del()
    return data;
}

