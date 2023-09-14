import db from "../db/index";
import { UserInterface } from '../utils/interfaces/interface'

type newUser = {
    firstname: string,
    email: string,
    password: string,
    createdAt?: Date,
}

export async function findUserFieldsById(id: number, fields: string | string[] = '*'): Promise<UserInterface | undefined> {
    const data = await db<UserInterface>('user').select(fields).where('id', id).first()
    return data;
}

export async function findUserByEmail(email: string, fields: string | string[] = '*'): Promise<UserInterface | undefined> {
    const data = await db<UserInterface>('user').select(fields).where('email', email).first()
    return data;
}

export async function createUser(user: newUser): Promise<number[] | undefined> {
    const data = await db('user').insert(user, ['createdAt', 'id', 'firstname', 'createdAt']);
    return data;
}

export async function deleteUser(id: number) {
    const data = await db('user').where('id', id).del()
    return data;
}

