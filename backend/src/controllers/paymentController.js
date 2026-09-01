import { body } from 'express-validator';
import asyncHandler from '../utils/asyncHandler.js';
import * as paymentService from '../services/paymentService.js';
import { handleValidation } from '../validators/authValidators.js';

export const initializePaymentValidation = [
  body('orderId').notEmpty().withMessage('Order is required').isMongoId().withMessage('Invalid order id'),
  handleValidation,
];

// @route  POST /api/payments/initialize
// @access Private
export const initializePayment = asyncHandler(async (req, res) => {
  const { authorizationUrl, reference } = await paymentService.initializePayment(req.body.orderId, req.user);
  res.status(200).json({
    success: true,
    message: 'Payment initialized.',
    data: { authorizationUrl, reference },
  });
});

// @route  GET /api/payments/verify/:reference
// @access Private
// Server-side verification against Paystack — the only step that unlocks a download.
export const verifyPayment = asyncHandler(async (req, res) => {
  const { order, payment } = await paymentService.verifyPayment(req.params.reference, req.user);
  res.status(200).json({
    success: true,
    message: payment.status === 'successful' ? 'Payment verified successfully.' : 'Payment was not successful.',
    data: { order, payment },
  });
});
