import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import designRoutes from './designRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import orderRoutes from './orderRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import downloadRoutes from './downloadRoutes.js';
import repairRoutes from './repairRoutes.js';
import customDesignRoutes from './customDesignRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/designs', designRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/downloads', downloadRoutes);
router.use('/repairs', repairRoutes);
router.use('/custom-designs', customDesignRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);

export default router;
