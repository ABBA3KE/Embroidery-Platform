import express from 'express';
import * as customDesignController from '../controllers/customDesignController.js';
import { protect } from '../middleware/auth.js';
import { uploadCustomDesignReference } from '../middleware/upload.js';
import { createCustomDesignValidation } from '../validators/customDesignValidators.js';

const router = express.Router();

router.use(protect);

router.post(
  '/',
  uploadCustomDesignReference.single('referenceImage'),
  createCustomDesignValidation,
  customDesignController.createCustomDesignRequest
);
router.get('/my', customDesignController.getMyCustomDesignRequests);
router.get('/payment/verify/:reference', customDesignController.verifyPayment);
router.get('/:id', customDesignController.getCustomDesignRequest);
router.post('/:id/approve-quotation', customDesignController.approveQuotation);
router.post('/:id/reject-quotation', customDesignController.rejectQuotation);
router.post('/:id/payment/initialize', customDesignController.initializePayment);
router.get('/:id/reference-image', customDesignController.downloadReferenceImage);
router.get('/:id/files/:format', customDesignController.downloadCompletedFile);

export default router;
