import { body, query } from 'express-validator';
import { handleValidation } from './authValidators.js';
import { DESIGN_FORMATS } from '../config/constants.js';

export const designValidation = [
  body('name').trim().notEmpty().withMessage('Design name is required')
    .isLength({ max: 120 }).withMessage('Design name cannot exceed 120 characters'),
  body('description').trim().notEmpty().withMessage('Description is required')
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  body('category').notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Category must be a valid id'),
  body('price').notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  handleValidation,
];

export const gallerySearchValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 48 }).withMessage('Limit must be between 1 and 48'),
  query('sort').optional().isIn(['newest', 'popular', 'price_low', 'price_high']).withMessage('Invalid sort option'),
  handleValidation,
];

export const protectedFileUploadValidation = [
  body('format').notEmpty().withMessage('Format is required')
    .isIn(DESIGN_FORMATS).withMessage(`Format must be one of: ${DESIGN_FORMATS.join(', ')}`),
  handleValidation,
];
