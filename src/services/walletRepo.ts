import db from "../db/index";
import { WalletInterface } from '../utils/interfaces/interface'

type newWallet = {
    userId: number
}

export async function createWallet(wallet: newWallet): Promise<number[] | undefined> {
    const data = await db('wallet').insert(wallet);
    return data;
}


