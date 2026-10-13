import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload';
import { protect } from '../middleware/auth';

const router = Router();

// Upload multiple photos
router.post('/multiple', protect, upload.array('photos', 10), (req: Request, res: Response): void => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ success: false, message: 'No images uploaded' });
      return;
    }

    const fileUrls = files.map((file) => `/uploads/${file.filename}`);

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      urls: fileUrls,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

export default router;
