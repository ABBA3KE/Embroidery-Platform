import express from 'express';
import * as repairController from '../controllers/repairController.js';
import { protect } from '../middleware/auth.js';
import { uploadRepairFiles } from '../middleware/upload.js';
import { createRepairValidation } from '../validators/repairValidators.js';

const router = express.Router();

router.use(protect);

router.post(
  '/',
  uploadRepairFiles.fields([
    { name: 'originalFile', maxCount: 1 },
    { name: 'referenceImage', maxCount: 1 },
  ]),
  createRepairValidation,
  repairController.createRepairRequest
);
router.get('/my', repairController.getMyRepairRequests);
router.get('/:id', repairController.getRepairRequest);
router.get('/:id/files/:type', repairController.downloadRepairFile);

export default router;
