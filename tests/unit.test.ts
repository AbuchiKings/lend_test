
import { mockReq, mockRes } from "sinon-express-mock";
import supertest from "supertest";

import App from ".";
import { UserInterface } from "../src/utils/interfaces/interface"
import * as auth from '../src/middlewares/auth'
import * as cache from '../src/cache/query';

import { AuthFailureError } from "../src/utils/requestUtils/ApiError";
import { getAccessToken, createToken, validate } from "../src/middlewares/auth";
import { getJson } from "../src/cache/query";
import {
    ACCESS_TOKEN, accessTokenKey, mockJwtValidate, addAuthHeaders,
    addHeaders,
    mockRedisGet,
    mockCreateUserFail,
    mockCreateUser,
    bcryptHashSpy,
    mockUserFindByEmail,
    createTokensSpy,
    firstname,
    USER_PASSWORD,
    USER_EMAIL,
    findUserByEmailSpy,
    createUserSpy,
    bcryptCompareSpy,
    setJsonSpy,
    verifyTokenSpy,
    getJsonSpy,
    jwtValidateSpy
} from "./mock"
import { createUser, deleteUser } from "../src/services/userRepo";
import db from '../src/db/index';


const request = supertest(App);
let obj = { userId: 0 }
async function clearData() {
    await db('user').where('id', obj.userId).del()
}

describe('Auth getAccessToken function', () => {
    beforeAll(() => {
        jest.clearAllMocks();
    });
    it('Should throw error when no authorization parameter is provided', () => {
        try {
            getAccessToken();
        } catch (e) {
            expect(e).toBeInstanceOf(AuthFailureError);
        }
    });

    it('Should throw error when an invalid authorization format is provided', () => {
        try {
            getAccessToken(`X- ${ACCESS_TOKEN}`);
        } catch (e: any) {
            expect(e).toBeInstanceOf(AuthFailureError);
            expect(e.message).toEqual('Invalid Authorization');
        }
    });

    it('Should return access token when valid authorization format is passed', () => {
        const accessToken = getAccessToken(`Bearer ${ACCESS_TOKEN}`);
        expect(accessToken).toEqual('randomaccess')
    });
});

describe('Auth createToken function', () => {
    beforeAll(() => {
        jest.clearAllMocks();
    });

    it('Should process an access token', async () => {
        const userId = 3

        const token = await createToken({ id: userId, email: "mytest@email.com" } as UserInterface, accessTokenKey);
        expect(token).toBeTruthy();
    });
});


describe('Routes', () => {
    afterAll(async () => {
        await clearData()
    })
    let token: string;

    describe('User signup', () => {

        beforeEach(() => {
            jest.clearAllMocks();
        });

        const endpoint = '/api/v1/auth/signup'
        it('Should throw error if empty body is sent', async () => {
            const response = await addHeaders(request.post(endpoint));
            expect(response.status).toBe(422);
            expect(mockCreateUser).not.toBeCalled();
            expect(bcryptHashSpy).not.toBeCalled();
            expect(mockUserFindByEmail).not.toBeCalled();
            expect(createTokensSpy).not.toBeCalled();
        });

        it('Should send error when email is not sent', async () => {
            const response = await addHeaders(
                request.post(endpoint).send({
                    firstname: firstname,
                    password: USER_PASSWORD,
                }),
            );
            expect(response.status).toBe(422);
            expect(response.body.message).toMatch(/email/i);
            expect(response.body.message).toMatch(/required/);
            expect(mockUserFindByEmail).not.toBeCalled();
            expect(bcryptHashSpy).not.toBeCalled();
            expect(mockCreateUser).not.toBeCalled();
            expect(createTokensSpy).not.toBeCalled();
        });

        it('Should send error when password is not valid format', async () => {
            const response = await addHeaders(
                request.post(endpoint).send({
                    email: USER_EMAIL,
                    firstname: firstname,
                    password: '123',
                }),
            );
            expect(response.status).toBe(422);
            expect(response.body.message).toMatch(/password must/i);
            expect(response.body.message).toMatch(/characters/);
            expect(mockUserFindByEmail).not.toBeCalled();
            expect(bcryptHashSpy).not.toBeCalled();
            expect(mockCreateUser).not.toBeCalled();
            expect(createTokensSpy).not.toBeCalled();
        });


        it('Should send success response for correct data', async () => {
            const response = await addHeaders(
                request.post(endpoint).send({
                    email: USER_EMAIL,
                    firstname: firstname,
                    password: USER_PASSWORD,
                }),
            );
            obj.userId = response.body?.data?.id
            expect(response.status).toBe(200);
            expect(response.body.message).toMatch(/successfully/i);
            expect(response.body.data).toBeDefined();

            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data).toHaveProperty('firstname');
            expect(response.body.data).toHaveProperty('email');

            expect(response.body.data.token).toBeDefined();

            expect(findUserByEmailSpy).toBeCalledTimes(1);
            expect(bcryptHashSpy).toBeCalledTimes(1);
            expect(createUserSpy).toBeCalledTimes(1);
            expect(createTokensSpy).toBeCalledTimes(1);
            expect(bcryptHashSpy).toBeCalledWith(USER_PASSWORD, 12);
        });

        it('Should send conflict error for existing emails', async () => {
            const response = await addHeaders(
                request.post(endpoint).send({
                    email: USER_EMAIL,
                    firstname: firstname,
                    password: USER_PASSWORD,
                }),
            );

            expect(response.status).toBe(409);
            expect(response.body.message).toMatch(/already exists/);
            expect(findUserByEmailSpy).not.toBeCalledTimes(1);
            expect(bcryptHashSpy).toBeCalled();
            expect(createUserSpy).toBeCalled();
            expect(createTokensSpy).not.toBeCalled();
        });
    });

    describe('User login', () => {

        beforeEach(() => {
            jest.clearAllMocks();
        });

        afterAll(async () => {
            await clearData()
        })

        const endpoint = '/api/v1/auth/login'
        it('Should throw error if empty body is sent', async () => {
            const response = await addHeaders(request.post(endpoint));
            expect(response.status).toBe(422);
            expect(mockCreateUser).not.toBeCalled();
            expect(bcryptHashSpy).not.toBeCalled();
            expect(mockUserFindByEmail).not.toBeCalled();
            expect(createTokensSpy).not.toBeCalled();
        });

        it('Should send error when email is not sent', async () => {
            const response = await addHeaders(
                request.post(endpoint).send({
                    password: USER_PASSWORD
                }),
            );
            expect(response.status).toBe(422);
            expect(response.body.message).toMatch(/email/i);
            expect(response.body.message).toMatch(/required/);
            expect(mockUserFindByEmail).not.toBeCalled();
            expect(bcryptHashSpy).not.toBeCalled();
            expect(mockCreateUser).not.toBeCalled();
            expect(createTokensSpy).not.toBeCalled();
        });

        it('Should send error when password is not valid format', async () => {
            const response = await addHeaders(
                request.post(endpoint).send({
                    email: USER_EMAIL,
                    password: '123',
                }),
            );
            expect(response.status).toBe(422);
            expect(response.body.message).toMatch(/Invalid/i);
            expect(response.body.message).toMatch(/password/);
            expect(mockUserFindByEmail).not.toBeCalled();
            expect(bcryptHashSpy).not.toBeCalled();
            expect(mockCreateUser).not.toBeCalled();
            expect(createTokensSpy).not.toBeCalled();
        });

        it('Should send error when password is wrong', async () => {
            const response = await addHeaders(
                request.post(endpoint).send({
                    email: USER_EMAIL,
                    password: '123rt56yh',
                }),
            );
            expect(response.status).toBe(401);
            expect(response.body.message).toMatch(/Incorrect/i);
            expect(response.body.message).toMatch(/password/);
            expect(findUserByEmailSpy).toBeCalledTimes(1);
            expect(bcryptHashSpy).not.toBeCalled();
            expect(createUserSpy).not.toBeCalled();
            expect(createTokensSpy).not.toBeCalled();
            expect(bcryptCompareSpy).toBeCalledTimes(1);
            expect(findUserByEmailSpy).toBeCalledTimes(1);
            expect(setJsonSpy).not.toBeCalled();
        });


        it('Should send success response for correct data', async () => {
            const response = await addHeaders(
                request.post(endpoint).send({
                    email: USER_EMAIL,
                    password: USER_PASSWORD,
                }),
            );
            token = response.body?.data?.token
            expect(response.status).toBe(200);
            expect(response.body.message).toMatch(/successfully/i);
            expect(response.body.data).toBeDefined();

            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data).toHaveProperty('firstname');
            expect(response.body.data).toHaveProperty('email');
            expect(response.body.data).toHaveProperty('token');

            expect(response.body.data.token).toBeDefined();

            expect(findUserByEmailSpy).toBeCalledTimes(1);
            expect(bcryptHashSpy).not.toBeCalled();
            expect(createUserSpy).not.toBeCalled();
            expect(createTokensSpy).toBeCalledTimes(1);
            expect(bcryptCompareSpy).toBeCalledTimes(1);
            expect(findUserByEmailSpy).toBeCalledTimes(1);
            expect(setJsonSpy).toBeCalledTimes(1);
        });

        it('Should send not found error for nonexistent user', async () => {
            const response = await addHeaders(
                request.post(endpoint).send({
                    email: 'USER_EMAIL@unknownemail.com',
                    password: USER_PASSWORD,
                }),
            );

            console.log(response.body)
            expect(response.status).toBe(401);
            expect(response.body.message).toMatch(/Incorrect/);
            expect(response.body.message).toMatch(/email/);
            expect(findUserByEmailSpy).toBeCalledTimes(1);
            expect(bcryptHashSpy).not.toBeCalled();
            expect(createUserSpy).not.toBeCalled();
            expect(createTokensSpy).not.toBeCalled();
        });
    });

    describe('Auth verifyToken middleware', () => {
        const endpoint = '/api/v1/auth/test';
    
        beforeEach(() => {
            jest.clearAllMocks();
        });
    
        it('Should response with 401 if Authorization header is not passed', async () => {
            const response = await addHeaders(request.get(endpoint));
            expect(response.status).toBe(401);
        });
    
        it('Should response with 401 if a wrong token is sent', async () => {
            const response = await addHeaders(request.get(endpoint)).set('Authorization', 'Bearer wrongToken');
            expect(response.status).toBe(401);
            expect(jwtValidateSpy).toBeCalledTimes(1);
        });

        it('Should response with 200 if a correct token is sent', async () => {
            const response = await addAuthHeaders(request.get(endpoint))
            .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(jwtValidateSpy).toBeCalledTimes(1);
            expect(getJsonSpy).toBeCalledTimes(1);
        });
    });

    describe('Fund User', () => {

        beforeEach(() => {
            jest.clearAllMocks();
        });

        afterAll(async () => {
            await clearData()
        })

        const endpoint = '/api/v1/transaction/fund'
        it('Should throw error if no authorization header is sent', async () => {
            const response = await addHeaders(request.post(endpoint)).send({
                amount: 10
            });
            expect(response.status).toBe(401);
            expect(response.body.message).toMatch(/Invalid Authorization/);
            expect(getJsonSpy).not.toBeCalled();
        });

        it('Should throw error if bad authorization header is sent', async () => {
            const response = await addHeaders(request.post(endpoint))
                .set('Authorization', `Bearer ${token}x`)
                .send({
                    amount: 10
                });
            expect(response.status).toBe(401);
            expect(response.body.message).toMatch(/Bad Token/);
            expect(getJsonSpy).not.toBeCalled();
        });

        it('Should send error when empty body is sent', async () => {
            const response = await addHeaders(
                request.post(endpoint))
                .set('Authorization', `Bearer ${token}`)
                .send({});
            expect(response.status).toBe(422);
            expect(response.body.message).toMatch(/amount/i);
            expect(response.body.message).toMatch(/required/);
            expect(getJsonSpy).toBeCalled();
            expect(jwtValidateSpy).toBeCalled();
        });

        //     it('Should send error when password is not valid format', async () => {
        //         const response = await addHeaders(
        //             request.post(endpoint).send({
        //                 email: USER_EMAIL,
        //                 firstname: firstname,
        //                 password: '123',
        //             }),
        //         );
        //         expect(response.status).toBe(422);
        //         expect(response.body.message).toMatch(/Invalid/i);
        //         expect(response.body.message).toMatch(/password/);
        //         expect(mockUserFindByEmail).not.toBeCalled();
        //         expect(bcryptHashSpy).not.toBeCalled();
        //         expect(mockCreateUser).not.toBeCalled();
        //         expect(createTokensSpy).not.toBeCalled();
        //     });


        //     it('Should send success response for correct data', async () => {
        //         const response = await addHeaders(
        //             request.post(endpoint).send({
        //                 email: USER_EMAIL,
        //                 password: USER_PASSWORD,
        //             }),
        //         );
        //         token = response.body?.data?.id
        //         expect(response.status).toBe(200);
        //         expect(response.body.message).toMatch(/successfully/i);
        //         expect(response.body.data).toBeDefined();

        //         expect(response.body.data).toHaveProperty('id');
        //         expect(response.body.data).toHaveProperty('firstname');
        //         expect(response.body.data).toHaveProperty('email');
        //         expect(response.body.data).toHaveProperty('token');

        //         expect(response.body.data.token).toBeDefined();

        //         expect(findUserByEmailSpy).toBeCalledTimes(1);
        //         expect(bcryptHashSpy).not.toBeCalled();
        //         expect(createUserSpy).not.toBeCalled();
        //         expect(createTokensSpy).toBeCalledTimes(1);
        //         expect(bcryptCompareSpy).toBeCalledTimes(1);
        //         expect(findUserByEmailSpy).toBeCalledTimes(1);
        //     });

        //     it('Should send not found error for nonexistent user', async () => {
        //         const response = await addHeaders(
        //             request.post(endpoint).send({
        //                 email: 'USER_EMAIL@unknownemail.com',
        //                 password: USER_PASSWORD,
        //             }),
        //         );

        //         console.log(response.body)
        //         expect(response.status).toBe(401);
        //         expect(response.body.message).toMatch(/Incorrect/);
        //         expect(response.body.message).toMatch(/email/);
        //         expect(findUserByEmailSpy).toBeCalled();
        //         expect(bcryptHashSpy).not.toBeCalled();
        //         expect(createUserSpy).not.toBeCalled();
        //         expect(createTokensSpy).not.toBeCalled();
        //     });
    });
});