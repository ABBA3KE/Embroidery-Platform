import asyncHandler from '../utils/asyncHandler.js';
import * as orderService from '../services/orderService.js';

// @route  POST /api/orders
// @access Private
export const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.user._id, req.body.designId);
  res.status(201).json({ success: true, message: 'Order created.', data: { order } });
});

// @route  GET /api/orders/my
// @access Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await orderService.listMyOrders(req.user._id, { page, limit });
  res.status(200).json({ success: true, data: result });
});

// @route  GET /api/orders/:id
// @access Private
export const getOrder = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.user);
  res.status(200).json({ success: true, data: { order } });
});
