import express from 'express';
import rateLimit from 'express-rate-limit';
import * as paymentController from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Verification hits an external API — keep it from being hammered.
const verifyLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many verification attempts. Please wait a moment and try again.' },
});

router.post('/initialize', paymentController.initializePaymentValidation, paymentController.initializePayment);
router.get('/verify/:reference', verifyLimiter, paymentController.verifyPayment);

export default router;
