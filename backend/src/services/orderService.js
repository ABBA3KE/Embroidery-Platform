import Order from '../models/Order.js';
import Design from '../models/Design.js';
import ApiError from '../utils/ApiError.js';
import generateReference from '../utils/generateReference.js';
import { ORDER_STATUS } from '../config/constants.js';

export const createOrder = async (userId, designId) => {
  const design = await Design.findOne({ _id: designId, status: 'published' });
  if (!design) {
    throw new ApiError(404, 'Design not found or is no longer available.');
  }

  // Reuse an existing pending order for the same design instead of piling up duplicates.
  const existingPending = await Order.findOne({ user: userId, design: designId, status: ORDER_STATUS.PENDING });
  if (existingPending) {
    return existingPending;
  }

  const order = await Order.create({
    user: userId,
    design: designId,
    orderReference: generateReference('ORD'),
    amount: design.price,
    currency: 'NGN',
    status: ORDER_STATUS.PENDING,
  });

  return order;
};

export const getOrderById = async (orderId, requestingUser) => {
  const order = await Order.findById(orderId).populate('design', 'name slug previewImage availableFormats');
  if (!order) throw new ApiError(404, 'Order not found.');

  if (String(order.user) !== String(requestingUser._id) && requestingUser.role !== 'admin') {
    throw new ApiError(403, 'You do not have access to this order.');
  }

  return order;
};

export const listMyOrders = async (userId, { page = 1, limit = 10 } = {}) => {
  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(50, Math.max(1, Number(limit) || 10));
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    Order.find({ user: userId })
      .populate('design', 'name slug previewImage availableFormats')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Order.countDocuments({ user: userId }),
  ]);

  return {
    orders,
    pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.max(1, Math.ceil(total / limitNum)) },
  };
};
