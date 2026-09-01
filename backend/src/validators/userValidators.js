import { body } from 'express-validator';
import { handleValidation } from './authValidators.js';

export const updateProfileValidation = [
  body('fullName').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Full name must be 2-100 characters'),
  body('phone').optional().trim().isLength({ min: 7, max: 20 }).withMessage('Please provide a valid phone number'),
  handleValidation,
];

export const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
    .matches(/\d/).withMessage('New password must contain at least one number')
    .matches(/[A-Za-z]/).withMessage('New password must contain at least one letter'),
  handleValidation,
];
