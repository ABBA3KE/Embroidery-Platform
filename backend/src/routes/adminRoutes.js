import express from 'express';
import * as designController from '../controllers/designController.js';
import * as categoryController from '../controllers/categoryController.js';
import * as repairController from '../controllers/repairController.js';
import * as customDesignController from '../controllers/customDesignController.js';
import * as adminController from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import {
  uploadPreviewImage,
  uploadProtectedFile,
  uploadRepairFiles,
  uploadCustomDesignCompletedFile,
} from '../middleware/upload.js';
import { designValidation, protectedFileUploadValidation } from '../validators/designValidators.js';
import { updateStatusValidation, addCommentValidation } from '../validators/repairValidators.js';
import {
  quotationValidation,
  customStatusValidation,
  customCommentValidation,
  customCompletedFileValidation,
} from '../validators/customDesignValidators.js';

const router = express.Router();

// Every route below is admin-only.
router.use(protect, authorize('admin'));

// Designs
router.get('/designs', designController.getDesignsAdmin);
router.get('/designs/:id', designController.getDesignAdmin);
router.post('/designs', uploadPreviewImage.single('previewImage'), designValidation, designController.createDesign);
router.put('/designs/:id', uploadPreviewImage.single('previewImage'), designController.updateDesign);
router.patch('/designs/:id/status', designController.setDesignStatus);
router.delete('/designs/:id', designController.deleteDesign);
router.post(
  '/designs/:id/files',
  uploadProtectedFile.single('file'),
  protectedFileUploadValidation,
  designController.uploadDesignFile
);

// Categories (full list including inactive)
router.get('/categories', categoryController.getAllCategoriesAdmin);

// Repair requests
router.get('/repairs', repairController.getRepairRequestsAdmin);
router.patch('/repairs/:id/status', updateStatusValidation, repairController.updateRepairStatus);
router.post('/repairs/:id/comments', addCommentValidation, repairController.addAdminComment);
router.post(
  '/repairs/:id/repaired-file',
  uploadRepairFiles.single('repairedFile'),
  repairController.uploadRepairedFile
);

// Custom design requests
router.get('/custom-designs', customDesignController.getCustomDesignRequestsAdmin);
router.post('/custom-designs/:id/quotation', quotationValidation, customDesignController.sendQuotation);
router.patch('/custom-designs/:id/status', customStatusValidation, customDesignController.updateStatus);
router.post('/custom-designs/:id/comments', customCommentValidation, customDesignController.addAdminComment);
router.post(
  '/custom-designs/:id/completed-files',
  uploadCustomDesignCompletedFile.single('file'),
  customCompletedFileValidation,
  customDesignController.uploadCompletedFile
);
router.post(
  '/custom-designs/:id/preview-image',
  uploadPreviewImage.single('previewImage'),
  customDesignController.uploadPreviewImage
);

// Dashboard stats
router.get('/stats', adminController.getStats);

// Customers
router.get('/customers', adminController.getCustomers);
router.get('/customers/:id', adminController.getCustomer);
router.patch('/customers/:id/status', adminController.updateCustomerStatus);

// Orders & Payments
router.get('/orders', adminController.getOrders);
router.get('/payments', adminController.getPayments);
router.get('/downloads', adminController.getDownloads);

// Reports
router.get('/reports', adminController.getReports);

export default router;
