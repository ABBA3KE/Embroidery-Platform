import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import Design from '../models/Design.js';
import ApiError from '../utils/ApiError.js';
import generateReference from '../utils/generateReference.js';
import * as paystackService from './paystackService.js';
import { createNotification } from './notificationService.js';
import { NOTIFICATION_TYPES, ORDER_STATUS, PAYMENT_STATUS } from '../config/constants.js';

export const initializePayment = async (orderId, user) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found.');

  if (String(order.user) !== String(user._id)) {
    throw new ApiError(403, 'You do not have access to this order.');
  }
  if (order.status === ORDER_STATUS.PAID) {
    throw new ApiError(409, 'This order has already been paid for.');
  }

  const paystackReference = generateReference('PSK');
  const amountKobo = Math.round(order.amount * 100);

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const transaction = await paystackService.initializeTransaction({
    email: user.email,
    amountKobo,
    reference: paystackReference,
    callbackUrl: `${clientUrl}/payment/callback`,
    metadata: { orderId: String(order._id), designId: String(order.design), userId: String(user._id) },
  });

  await Payment.create({
    order: order._id,
    user: user._id,
    design: order.design,
    paystackReference,
    amount: order.amount,
    currency: order.currency,
    status: PAYMENT_STATUS.PENDING,
  });

  return {
    authorizationUrl: transaction.authorization_url,
    reference: paystackReference,
  };
};

/**
 * Verifies a payment directly against Paystack's API. This is the single
 * source of truth for payment success — the frontend callback page merely
 * triggers this check, it never unlocks anything on its own.
 */
export const verifyPayment = async (reference, user) => {
  const payment = await Payment.findOne({ paystackReference: reference });
  if (!payment) throw new ApiError(404, 'Payment record not found.');

  if (String(payment.user) !== String(user._id) && user.role !== 'admin') {
    throw new ApiError(403, 'You do not have access to this payment.');
  }

  // Idempotent — if we've already confirmed this payment, don't hit Paystack again.
  if (payment.status === PAYMENT_STATUS.SUCCESSFUL) {
    const order = await Order.findById(payment.order).populate('design', 'name slug availableFormats');
    return { order, payment };
  }

  const transaction = await paystackService.verifyTransaction(reference);
  const order = await Order.findById(payment.order);

  const expectedAmountKobo = Math.round(payment.amount * 100);
  const isGenuinelySuccessful =
    transaction.status === 'success' && transaction.amount === expectedAmountKobo;

  if (isGenuinelySuccessful) {
    payment.status = PAYMENT_STATUS.SUCCESSFUL;
    payment.channel = transaction.channel;
    payment.gatewayResponse = transaction.gateway_response;
    payment.paidAt = transaction.paid_at ? new Date(transaction.paid_at) : new Date();
    await payment.save();

    order.status = ORDER_STATUS.PAID;
    order.paidAt = payment.paidAt;
    await order.save();

    await Design.findByIdAndUpdate(order.design, { $inc: { purchaseCount: 1 } });

    await createNotification({
      user: user._id,
      type: NOTIFICATION_TYPES.PAYMENT_SUCCESSFUL,
      title: 'Payment successful',
      message: 'Your payment was verified. Your download is now available.',
      link: '/dashboard/purchases',
    });
    await createNotification({
      user: user._id,
      type: NOTIFICATION_TYPES.DOWNLOAD_AVAILABLE,
      title: 'Download available',
      message: 'Your purchased design is ready to download from your dashboard.',
      link: '/dashboard/purchases',
    });
  } else {
    payment.status = transaction.status === 'abandoned' ? PAYMENT_STATUS.CANCELLED : PAYMENT_STATUS.FAILED;
    payment.gatewayResponse = transaction.gateway_response;
    await payment.save();

    await createNotification({
      user: user._id,
      type: NOTIFICATION_TYPES.PAYMENT_FAILED,
      title: 'Payment not completed',
      message: 'Your payment could not be verified. You can try again from your order.',
      link: '/dashboard/purchases',
    });
  }

  const populatedOrder = await Order.findById(order._id).populate('design', 'name slug availableFormats');
  return { order: populatedOrder, payment };
};
