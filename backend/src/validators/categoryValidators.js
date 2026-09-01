import { body } from 'express-validator';
import { handleValidation } from './authValidators.js';

export const categoryValidation = [
  body('name').trim().notEmpty().withMessage('Category name is required')
    .isLength({ max: 60 }).withMessage('Category name cannot exceed 60 characters'),
  body('description').optional().trim().isLength({ max: 300 }).withMessage('Description cannot exceed 300 characters'),
  handleValidation,
];
