import { Router } from 'express';
import {
  createInquiry,
  getPropertyInquiries,
  getMyInquiries,
} from '../controllers/inquiryController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/', createInquiry);
router.get('/my-inquiries', protect, getMyInquiries);
router.get('/property/:propertyId', protect, getPropertyInquiries);

export default router;
