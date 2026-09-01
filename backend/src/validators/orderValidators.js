import { body } from 'express-validator';
import { handleValidation } from './authValidators.js';

export const createOrderValidation = [
  body('designId').notEmpty().withMessage('Design is required').isMongoId().withMessage('Invalid design id'),
  handleValidation,
];
