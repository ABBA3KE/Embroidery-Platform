import express from 'express';
import * as userController from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { updateProfileValidation, changePasswordValidation } from '../validators/userValidators.js';

const router = express.Router();

router.use(protect);

router.put('/me', updateProfileValidation, userController.updateProfile);
router.put('/me/password', changePasswordValidation, userController.changePassword);

export default router;
