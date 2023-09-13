import db from "../db/index";
import { UserInterface } from '../utils/interfaces/interface'

type newUser = {
    firstname: string,
    email: string,
    password: string,
    createdAt?: Date,
}

export async function findFieldsById(id: number, fields = '*'): Promise<UserInterface | undefined> {
    const data = await db<UserInterface>('user').select(fields).where('id', id).first()
    return data;
}

export async function findByEmail(email: string, fields = '*'): Promise<UserInterface | undefined> {
        const data = await db<UserInterface>('user').select(fields).where('email', email).first()
        return data;
}

export async function create(user: newUser): Promise<number[] | undefined> {
    const data = await db('user').insert([user], ['createdAt', 'id', 'firstname', 'createdAt']);
    return data;
}

