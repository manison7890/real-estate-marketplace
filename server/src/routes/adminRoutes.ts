import { Router } from 'express';
import {
  getAdminStats,
  getAdminProperties,
  toggleVerifyProperty,
  toggleFeatureProperty,
  deleteAdminProperty,
  getAdminUsers,
  getAdminInquiries,
} from '../controllers/adminController';

const router = Router();

// Admin operations
router.get('/stats', getAdminStats);
router.get('/properties', getAdminProperties);
router.patch('/properties/:id/verify', toggleVerifyProperty);
router.patch('/properties/:id/feature', toggleFeatureProperty);
router.delete('/properties/:id', deleteAdminProperty);
router.get('/users', getAdminUsers);
router.get('/inquiries', getAdminInquiries);

export default router;
