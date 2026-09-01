import express from 'express';
import * as categoryController from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/auth.js';
import { categoryValidation } from '../validators/categoryValidators.js';

const router = express.Router();

router.get('/', categoryController.getCategories);
router.get('/:slug', categoryController.getCategory);

router.post('/', protect, authorize('admin'), categoryValidation, categoryController.createCategory);
router.put('/:id', protect, authorize('admin'), categoryValidation, categoryController.updateCategory);
router.delete('/:id', protect, authorize('admin'), categoryController.deleteCategory);

export default router;
