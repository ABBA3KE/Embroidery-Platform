import express from 'express';
import * as orderController from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';
import { createOrderValidation } from '../validators/orderValidators.js';

const router = express.Router();

router.use(protect);

router.post('/', createOrderValidation, orderController.createOrder);
router.get('/my', orderController.getMyOrders);
router.get('/:id', orderController.getOrder);

export default router;
