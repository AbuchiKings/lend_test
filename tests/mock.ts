import bcrypt from 'bcrypt';
import { JsonWebTokenError } from "jsonwebtoken";
import { JwtPayload } from "../src/middlewares/auth";
import { UserInterface } from "../src/utils/interfaces/interface";
import { findUserByEmail, newUser } from "../src/services/userRepo";
import * as userRepo from "../src/services/userRepo";
import * as auth from '../src/middlewares/auth';
import * as cache from '../src/cache/query';


export const ACCESS_TOKEN = 'randomaccess';
export const accessTokenKey = 'hjdydtr';
export const USER_ID = 3;
export const USER_EMAIL = 'mytest@email.com';
export const firstname = 'abuchi';
export const USER_PASSWORD = 'qwerty'
export const USER_PASSWORD_HASH = bcrypt.hashSync(USER_PASSWORD, 10);

//export const mockTestMethodSpy = jest.spyOn(new UserController(), 'test');

export const mockJwtValidate = jest.fn(
    async (token: string): Promise<JwtPayload> => {
        if (token === ACCESS_TOKEN) {
            return {
                aud: 'access',
                key: accessTokenKey,
                iss: 'issuer',
                iat: 1,
                exp: 2,
                sub: USER_ID,
                email: USER_EMAIL
            } as JwtPayload;
        }
        throw new JsonWebTokenError(`Bad Token`);
    },
);

export const mockRedisGet = jest.fn(
    async (key: string): Promise<UserInterface | undefined> => {
        if (key === `${USER_ID}:${accessTokenKey}`)
            return { id: USER_ID, email: USER_EMAIL, firstname };
        return;
    }
);

export const mockCreateUser = jest.fn(
    async (user: newUser): Promise<UserInterface | undefined> => {
        if (user.firstname)
            return {
                id: 3,
                firstname: firstname,
                email: USER_EMAIL,
                password: 'password'
            };
        return;
    }
);

export const mockCreateUserFail = jest.fn(
    async (user: newUser): Promise<UserInterface | undefined> => {
        return;
    }
);

export const mockUserFindByEmail = jest.fn(
    async (email: string): Promise<UserInterface | null> => {
        if (email === USER_EMAIL)
            return {
                id: USER_ID,
                email: USER_EMAIL,
                password: USER_PASSWORD_HASH,
                firstname: 'abc',
            };
        return null;
    },
);


export const bcryptHashSpy = jest.spyOn(bcrypt, 'hash');
export const bcryptCompareSpy = jest.spyOn(bcrypt, 'compare');

export const createTokensSpy = jest.spyOn(auth, 'createToken');
export const verifyTokenSpy = jest.spyOn(auth, 'verifyToken');
export const jwtValidateSpy = jest.spyOn(auth, 'validate');
export const getAccessTokenSpy = jest.spyOn(auth, 'getAccessToken');
export const createUserSpy = jest.spyOn(userRepo, 'createUser');
export const findUserByEmailSpy = jest.spyOn(userRepo, 'findUserByEmail');

export const getJsonSpy = jest.spyOn(cache, 'getJson');
export const setJsonSpy = jest.spyOn(cache, 'setJson');



export const addHeaders = (request: any) =>
    request.set('Content-Type', 'application/json').timeout(4000);

export const addAuthHeaders = (request: any, accessToken = ACCESS_TOKEN) =>
    request
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .timeout(4000);

// jest.mock('../src/services/userRepo', () => ({
//     createUser: mockCreateUser,
//     findUserByEmail: mockUserFindByEmail

// }));


// export const INVALID_EMAIL = 'abuchikings@email'
// export const USER_EMAIL = 'abuchikings@email.com'
// export const FIRSTNAME = 'Agodi'
// export const INVALID_PASSWORD = 'ab'
// export const PASSWROD = 'qwerty12345'
// export const RECIPIENT = {
//     "firstname": "Amando",
//     "password": "qwerty12345",
//     "email": "ama@myemail.com",
// }
// export const EXISTING_EMAIL = 'abu@myemail.com';
// export const RANDOM_EMAIL = 'abu@randomemail.com';