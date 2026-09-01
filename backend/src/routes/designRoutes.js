import express from 'express';
import * as designController from '../controllers/designController.js';
import { gallerySearchValidation } from '../validators/designValidators.js';

const router = express.Router();

router.get('/', gallerySearchValidation, designController.getDesigns);
router.get('/:slug', designController.getDesign);

export default router;
