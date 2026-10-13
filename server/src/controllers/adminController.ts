import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Property } from '../models/Property';
import { Inquiry } from '../models/Inquiry';
import { memoryProperties, memoryUsers, memoryInquiries } from '../utils/memoryStore';

export const getAdminStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const totalProperties = memoryProperties.length;
      const verifiedProperties = memoryProperties.filter((p) => p.verified).length;
      const featuredProperties = memoryProperties.filter((p) => p.featured).length;
      const totalUsers = memoryUsers.length;
      const totalInquiries = memoryInquiries.length;
      const totalViews = memoryProperties.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);

      res.status(200).json({
        success: true,
        stats: {
          totalProperties,
          verifiedProperties,
          featuredProperties,
          totalUsers,
          totalInquiries,
          totalViews,
        },
      });
      return;
    }

    const [totalProperties, verifiedProperties, featuredProperties, totalUsers, totalInquiries] =
      await Promise.all([
        Property.countDocuments(),
        Property.countDocuments({ verified: true }),
        Property.countDocuments({ featured: true }),
        User.countDocuments(),
        Inquiry.countDocuments(),
      ]);

    const viewsAgg = await Property.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$viewsCount' } } },
    ]);
    const totalViews = viewsAgg[0]?.totalViews || 0;

    res.status(200).json({
      success: true,
      stats: {
        totalProperties,
        verifiedProperties,
        featuredProperties,
        totalUsers,
        totalInquiries,
        totalViews,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getAdminProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 1) {
      res.status(200).json({
        success: true,
        properties: memoryProperties,
      });
      return;
    }

    const properties = await Property.find().sort({ createdAt: -1 }).populate('owner', 'name email phone');
    res.status(200).json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const toggleVerifyProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState !== 1) {
      const prop = memoryProperties.find((p) => p._id === id);
      if (prop) {
        prop.verified = !prop.verified;
        res.status(200).json({ success: true, verified: prop.verified });
        return;
      }
      res.status(404).json({ success: false, message: 'Property not found' });
      return;
    }

    const prop = await Property.findById(id);
    if (!prop) {
      res.status(404).json({ success: false, message: 'Property not found' });
      return;
    }

    prop.verified = !prop.verified;
    await prop.save();
    res.status(200).json({ success: true, verified: prop.verified });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const toggleFeatureProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState !== 1) {
      const prop = memoryProperties.find((p) => p._id === id);
      if (prop) {
        prop.featured = !prop.featured;
        res.status(200).json({ success: true, featured: prop.featured });
        return;
      }
      res.status(404).json({ success: false, message: 'Property not found' });
      return;
    }

    const prop = await Property.findById(id);
    if (!prop) {
      res.status(404).json({ success: false, message: 'Property not found' });
      return;
    }

    prop.featured = !prop.featured;
    await prop.save();
    res.status(200).json({ success: true, featured: prop.featured });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const deleteAdminProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState !== 1) {
      const idx = memoryProperties.findIndex((p) => p._id === id);
      if (idx !== -1) {
        memoryProperties.splice(idx, 1);
      }
      res.status(200).json({ success: true, message: 'Property deleted by Admin' });
      return;
    }

    await Property.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Property deleted by Admin' });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getAdminUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const sanitized = memoryUsers.map(({ password, ...u }) => u);
      res.status(200).json({ success: true, users: sanitized });
      return;
    }

    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getAdminInquiries = async (_req: Request, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const formatted = memoryInquiries.map((inq: any) => ({
        ...inq,
        propertyTitle:
          inq.propertyTitle ||
          (typeof inq.property === 'object' ? inq.property?.title : 'Property Listing'),
        propertyId:
          inq.propertyId ||
          (typeof inq.property === 'object' ? inq.property?._id : inq.property),
      }));
      res.status(200).json({ success: true, inquiries: formatted });
      return;
    }

    const inquiries = await Inquiry.find()
      .populate('property', 'title location price listingType')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
