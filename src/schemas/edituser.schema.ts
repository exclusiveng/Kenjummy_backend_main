import { body } from 'express-validator';

export const editUserSchema = [
  body('fullName')
    .optional()
    .isString()
    .withMessage('Full name must be a string')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Full name must be between 3 and 100 characters'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),

  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Invalid phone number'),
];
