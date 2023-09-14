import { Request, Response, NextFunction } from 'express'
import { body, param, query, validationResult } from 'express-validator';

import { UnprocessibleEntityError } from '../utils/requestUtils/ApiError';

export const validateEmail = (email: string) => [
    body(email)
        .exists({ checkFalsy: true, checkNull: true })
        .withMessage(`${email} is required`)
        .normalizeEmail({ all_lowercase: true })
        .isEmail()
        .withMessage('Invalid email address.')
        .isLength({ max: 100 })
        .withMessage('Email cannot have more than 100 characters.'),
];

export const validateIdParam = (...ids: string[]) => {
    return param(ids)
        .exists()
        .withMessage('Onre or more Id parameters are missing.')
        .isInt({ min: 1, max: 100000000 })
        .withMessage('One or more id parameters are invalid.');
};


export const validateCreateUser = [
    body('firstname')
        .exists().withMessage('Firstname is required.')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must have a minimun of two(2) characters and a maximum of 100 characters.')
        .escape()
        .bail()
        .matches(/^[A-Za-z]+$/)
        .withMessage('Special characters, numbers or spaces are not allowed in name fields.')
        .toLowerCase(),
    body('password')
        .exists({ checkFalsy: true, checkNull: true })
        .withMessage('Please enter your password. Epty spaces at start or end of passwords will be trimmed')
        .trim()
        .isLength({ min: 5, max: 100 })
        .withMessage('Password must have between 5 and 100 characters.')
        .bail(),
    body('email')
        .exists({ checkFalsy: true, checkNull: true })
        .withMessage(`Email is required`)
        .trim()
        .normalizeEmail({ all_lowercase: true })
        .isEmail()
        .withMessage('Invalid email address.')
        .isLength({ max: 100 })
        .withMessage('Email cannot have more than 60 characters.')
        .escape(),
];

export const validateLogin = [
    body('password')
        .exists({ checkFalsy: true, checkNull: true })
        .withMessage('Please enter your password.')
        .isLength({ min: 5, max: 100 })
        .withMessage('Invalid email or password.'),
    validateCreateUser[2],
];

export const validateFundWallet = [
    body('amount')
        .exists({ checkFalsy: true, checkNull: true })
        .withMessage('Amount is required')
        .matches(/^[0-9.]+$/)
        .withMessage('Non numeric values or numeric values with symbols are not allowed')
        .isDecimal({ force_decimal: false, decimal_digits: '0,2', locale: 'en-US' })
        .withMessage('Decimal digits count cannot exceed 2')
        .custom(value => 5.00 <= value && value <= 1000000000.00)
        .withMessage('Amount must be between NGN5.00 and 1 billion')
]

export const validateTransfer = [
    validateFundWallet[0],
    validateEmail('recipientEmail')[0]
]


export const validationHandler = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new UnprocessibleEntityError(errors.array()[0].msg);
    } else {
        next();
    }
};

