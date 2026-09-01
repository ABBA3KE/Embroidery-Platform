import { body } from 'express-validator';
import { handleValidation } from './authValidators.js';
import { CUSTOM_DESIGN_STATUS, DESIGN_FORMATS } from '../config/constants.js';

export const createCustomDesignValidation = [
  body('title').trim().notEmpty().withMessage('Design title is required')
    .isLength({ max: 120 }).withMessage('Title cannot exceed 120 characters'),
  body('category').notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Category must be a valid id'),
  body('description').trim().notEmpty().withMessage('Description is required')
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  body('preferredFormat').optional().isIn(DESIGN_FORMATS).withMessage('Invalid preferred format'),
  body('preferredSize').optional().trim().isLength({ max: 100 }),
  body('intendedUse').optional().trim().isLength({ max: 200 }),
  body('additionalInstructions').optional().trim().isLength({ max: 1000 }),
  handleValidation,
];

export const quotationValidation = [
  body('amount').notEmpty().withMessage('Quotation amount is required')
    .isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('notes').optional().trim().isLength({ max: 1000 }),
  handleValidation,
];

export const customStatusValidation = [
  body('status').notEmpty().withMessage('Status is required')
    .isIn(Object.values(CUSTOM_DESIGN_STATUS)).withMessage('Invalid status value'),
  handleValidation,
];

export const customCommentValidation = [
  body('comment').trim().notEmpty().withMessage('Comment cannot be empty')
    .isLength({ max: 1000 }).withMessage('Comment cannot exceed 1000 characters'),
  handleValidation,
];

export const customCompletedFileValidation = [
  body('format').notEmpty().withMessage('Format is required')
    .isIn(DESIGN_FORMATS).withMessage(`Format must be one of: ${DESIGN_FORMATS.join(', ')}`),
  handleValidation,
];
