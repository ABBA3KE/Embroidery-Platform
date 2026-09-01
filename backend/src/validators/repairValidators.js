import { body } from 'express-validator';
import { handleValidation } from './authValidators.js';
import { REPAIR_STATUS, REPAIR_SERVICE_TYPES } from '../config/constants.js';

export const createRepairValidation = [
  body('serviceType')
    .notEmpty().withMessage('Service type is required')
    .isIn(Object.values(REPAIR_SERVICE_TYPES)).withMessage('Invalid service type'),
  body('description').trim().notEmpty().withMessage('Description is required')
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  body('additionalInstructions').optional().trim().isLength({ max: 1000 }),
  handleValidation,
];

export const updateStatusValidation = [
  body('status').notEmpty().withMessage('Status is required')
    .isIn(Object.values(REPAIR_STATUS)).withMessage('Invalid status value'),
  handleValidation,
];

export const addCommentValidation = [
  body('comment').trim().notEmpty().withMessage('Comment cannot be empty')
    .isLength({ max: 1000 }).withMessage('Comment cannot exceed 1000 characters'),
  handleValidation,
];
