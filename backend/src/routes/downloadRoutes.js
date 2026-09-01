import express from 'express';
import * as downloadController from '../controllers/downloadController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/my', downloadController.getMyDownloads);
router.get('/:designId/:format', downloadController.downloadDesignFile);

export default router;
