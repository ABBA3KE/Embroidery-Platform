import asyncHandler from '../utils/asyncHandler.js';
import * as adminService from '../services/adminService.js';

// @route  GET /api/admin/stats
export const getStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getDashboardStats();
  res.status(200).json({ success: true, data: { stats } });
});

// @route  GET /api/admin/customers
export const getCustomers = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.query;
  const result = await adminService.listCustomers({ page, limit, search });
  res.status(200).json({ success: true, data: result });
});

// @route  GET /api/admin/customers/:id
export const getCustomer = asyncHandler(async (req, res) => {
  const result = await adminService.getCustomerDetail(req.params.id);
  res.status(200).json({ success: true, data: result });
});

// @route  PATCH /api/admin/customers/:id/status
export const updateCustomerStatus = asyncHandler(async (req, res) => {
  const customer = await adminService.updateCustomerStatus(req.params.id, req.body.status);
  res.status(200).json({ success: true, message: 'Customer status updated.', data: { customer } });
});

// @route  GET /api/admin/orders
export const getOrders = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query;
  const result = await adminService.listOrdersAdmin({ page, limit, status });
  res.status(200).json({ success: true, data: result });
});

// @route  GET /api/admin/payments
export const getPayments = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query;
  const result = await adminService.listPaymentsAdmin({ page, limit, status });
  res.status(200).json({ success: true, data: result });
});

// @route  GET /api/admin/downloads
export const getDownloads = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await adminService.listDownloadsAdmin({ page, limit });
  res.status(200).json({ success: true, data: result });
});

// @route  GET /api/admin/reports
export const getReports = asyncHandler(async (req, res) => {
  const { range, from, to } = req.query;
  const report = await adminService.getReports({ range, from, to });
  res.status(200).json({ success: true, data: { report } });
});
