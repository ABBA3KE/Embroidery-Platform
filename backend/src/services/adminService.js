import User from '../models/User.js';
import Design from '../models/Design.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import Download from '../models/Download.js';
import RepairRequest from '../models/RepairRequest.js';
import CustomDesignRequest from '../models/CustomDesignRequest.js';
import ApiError from '../utils/ApiError.js';
import { ORDER_STATUS, REPAIR_STATUS, CUSTOM_DESIGN_STATUS, PAYMENT_STATUS } from '../config/constants.js';

export const getDashboardStats = async () => {
  const [
    totalCustomers,
    totalDesigns,
    totalOrders,
    successfulPayments,
    revenueAgg,
    pendingRepairs,
    completedRepairs,
    totalDownloads,
    totalCustomRequests,
    pendingCustomRequests,
    completedCustomRequests,
    customRevenueAgg,
  ] = await Promise.all([
    User.countDocuments({ role: 'customer' }),
    Design.countDocuments(),
    Order.countDocuments(),
    Payment.countDocuments({ status: PAYMENT_STATUS.SUCCESSFUL }),
    Order.aggregate([{ $match: { status: ORDER_STATUS.PAID } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    RepairRequest.countDocuments({ status: { $in: [REPAIR_STATUS.PENDING, REPAIR_STATUS.UNDER_REVIEW, REPAIR_STATUS.ACCEPTED, REPAIR_STATUS.IN_PROGRESS] } }),
    RepairRequest.countDocuments({ status: REPAIR_STATUS.COMPLETED }),
    Download.countDocuments(),
    CustomDesignRequest.countDocuments(),
    CustomDesignRequest.countDocuments({ status: { $nin: [CUSTOM_DESIGN_STATUS.COMPLETED, CUSTOM_DESIGN_STATUS.REJECTED, CUSTOM_DESIGN_STATUS.CANCELLED] } }),
    CustomDesignRequest.countDocuments({ status: CUSTOM_DESIGN_STATUS.COMPLETED }),
    CustomDesignRequest.aggregate([
      { $match: { paymentStatus: PAYMENT_STATUS.SUCCESSFUL } },
      { $group: { _id: null, total: { $sum: '$quotation.amount' } } },
    ]),
  ]);

  return {
    totalCustomers,
    totalDesigns,
    totalOrders,
    successfulPayments,
    revenue: revenueAgg[0]?.total || 0,
    pendingRepairs,
    completedRepairs,
    totalDownloads,
    totalCustomRequests,
    pendingCustomRequests,
    completedCustomRequests,
    customDesignRevenue: customRevenueAgg[0]?.total || 0,
  };
};

export const listCustomers = async ({ page = 1, limit = 20, search } = {}) => {
  const filter = { role: 'customer' };
  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [customers, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    User.countDocuments(filter),
  ]);

  return {
    customers: customers.map((c) => c.toSafeObject()),
    pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.max(1, Math.ceil(total / limitNum)) },
  };
};

export const getCustomerDetail = async (id) => {
  const customer = await User.findById(id);
  if (!customer) throw new ApiError(404, 'Customer not found.');

  const [orders, repairs, customRequests, downloads] = await Promise.all([
    Order.find({ user: id }).populate('design', 'name slug previewImage').sort({ createdAt: -1 }),
    RepairRequest.find({ user: id }).sort({ createdAt: -1 }),
    CustomDesignRequest.find({ user: id }).populate('category', 'name').sort({ createdAt: -1 }),
    Download.find({ user: id }).populate('design', 'name slug').sort({ createdAt: -1 }).limit(50),
  ]);

  return { customer: customer.toSafeObject(), orders, repairs, customRequests, downloads };
};

export const updateCustomerStatus = async (id, status) => {
  if (!['active', 'suspended'].includes(status)) {
    throw new ApiError(400, 'Status must be either "active" or "suspended".');
  }
  const customer = await User.findByIdAndUpdate(id, { status }, { new: true });
  if (!customer) throw new ApiError(404, 'Customer not found.');
  return customer.toSafeObject();
};

export const listOrdersAdmin = async ({ page = 1, limit = 20, status } = {}) => {
  const filter = {};
  if (status) filter.status = status;

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'fullName email')
      .populate('design', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Order.countDocuments(filter),
  ]);

  return {
    orders,
    pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.max(1, Math.ceil(total / limitNum)) },
  };
};

export const listPaymentsAdmin = async ({ page = 1, limit = 20, status } = {}) => {
  const filter = {};
  if (status) filter.status = status;

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [payments, total] = await Promise.all([
    Payment.find(filter)
      .populate('user', 'fullName email')
      .populate('design', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Payment.countDocuments(filter),
  ]);

  return {
    payments,
    pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.max(1, Math.ceil(total / limitNum)) },
  };
};

export const listDownloadsAdmin = async ({ page = 1, limit = 20 } = {}) => {
  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [downloads, total] = await Promise.all([
    Download.find()
      .populate('user', 'fullName email')
      .populate('design', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Download.countDocuments(),
  ]);

  return {
    downloads,
    pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.max(1, Math.ceil(total / limitNum)) },
  };
};

const DATE_RANGE_TO_START = {
  today: () => new Date(new Date().setHours(0, 0, 0, 0)),
  week: () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  month: () => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  year: () => new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
};

export const getReports = async ({ range = 'month', from, to } = {}) => {
  let startDate;
  let endDate = to ? new Date(to) : new Date();

  if (from) {
    startDate = new Date(from);
  } else if (DATE_RANGE_TO_START[range]) {
    startDate = DATE_RANGE_TO_START[range]();
  } else {
    startDate = DATE_RANGE_TO_START.month();
  }

  const dateFilter = { createdAt: { $gte: startDate, $lte: endDate } };

  const [
    salesAgg,
    mostPurchased,
    newCustomers,
    downloadsInRange,
    repairsPending,
    repairsCompleted,
    customRequestsInRange,
    customRevenueAgg,
    mostRequestedCategories,
    avgCompletionAgg,
  ] = await Promise.all([
    Order.aggregate([
      { $match: { status: ORDER_STATUS.PAID, ...dateFilter } },
      { $group: { _id: null, totalSales: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),
    Order.aggregate([
      { $match: { status: ORDER_STATUS.PAID } },
      { $group: { _id: '$design', purchases: { $sum: 1 } } },
      { $sort: { purchases: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'designs', localField: '_id', foreignField: '_id', as: 'design' } },
      { $unwind: '$design' },
      { $project: { 'design.name': 1, 'design.slug': 1, purchases: 1 } },
    ]),
    User.countDocuments({ role: 'customer', ...dateFilter }),
    Download.countDocuments(dateFilter),
    RepairRequest.countDocuments({ status: { $ne: REPAIR_STATUS.COMPLETED } }),
    RepairRequest.countDocuments({ status: REPAIR_STATUS.COMPLETED, ...dateFilter }),
    CustomDesignRequest.countDocuments(dateFilter),
    CustomDesignRequest.aggregate([
      { $match: { paymentStatus: PAYMENT_STATUS.SUCCESSFUL, ...dateFilter } },
      { $group: { _id: null, total: { $sum: '$quotation.amount' } } },
    ]),
    CustomDesignRequest.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
      { $unwind: '$category' },
      { $project: { 'category.name': 1, count: 1 } },
    ]),
    RepairRequest.aggregate([
      { $match: { status: REPAIR_STATUS.COMPLETED, completedAt: { $exists: true } } },
      { $project: { hours: { $divide: [{ $subtract: ['$completedAt', '$createdAt'] }, 1000 * 60 * 60] } } },
      { $group: { _id: null, avgHours: { $avg: '$hours' } } },
    ]),
  ]);

  return {
    range: { startDate, endDate },
    totalSales: salesAgg[0]?.totalSales || 0,
    totalPurchases: salesAgg[0]?.count || 0,
    mostPurchasedDesigns: mostPurchased,
    newCustomers,
    downloadsInRange,
    pendingRepairs: repairsPending,
    completedRepairsInRange: repairsCompleted,
    customRequestsInRange,
    customDesignRevenue: customRevenueAgg[0]?.total || 0,
    mostRequestedCategories,
    averageRepairCompletionHours: Math.round((avgCompletionAgg[0]?.avgHours || 0) * 10) / 10,
  };
};
