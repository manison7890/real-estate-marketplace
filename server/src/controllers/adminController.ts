import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Property } from '../models/Property';
import { Inquiry } from '../models/Inquiry';
import { fallbackProperties } from '../utils/sampleData';

// Simulated in-memory admin store for staging / offline preview
let adminProperties = [...fallbackProperties];
let adminUsers = [
  {
    _id: 'admin-001',
    name: 'Ramlogics Real Estate Admin',
    email: 'admin@ramlogics.com',
    phone: '+91 99999 88888',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'user-002',
    name: 'Rohit Sharma',
    email: 'rohit@ramlogics.com',
    phone: '+91 98200 12345',
    role: 'agent',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'user-003',
    name: 'Priya Nair',
    email: 'priya.nair@gmail.com',
    phone: '+91 98450 67890',
    role: 'owner',
    createdAt: new Date().toISOString(),
  },
];

let adminInquiries = [
  {
    _id: 'inq-001',
    propertyTitle: 'Luxury 3 BHK Sea View Apartment in Worli',
    propertyId: 'sample-prop-01',
    name: 'Amit Patel',
    phone: '+91 98211 44556',
    email: 'amit.patel@gmail.com',
    message: 'Looking to schedule a weekend site visit with family.',
    status: 'new',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    _id: 'inq-002',
    propertyTitle: 'Spacious 2 BHK Apartment for Rent in Koramangala',
    propertyId: 'sample-prop-02',
    name: 'Deepak Rao',
    phone: '+91 98765 11223',
    email: 'deepak.rao@infosys.com',
    message: 'Is the apartment available for immediate lease?',
    status: 'contacted',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    _id: 'inq-003',
    propertyTitle: 'Modern 4 BHK Independent Villa in Golf Course Road',
    propertyId: 'sample-prop-03',
    name: 'Siddharth Jain',
    phone: '+91 99110 99887',
    email: 'siddharth@jainholdings.com',
    message: 'Interested in making an offer. Please share payment schedule.',
    status: 'scheduled',
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
  },
];

export const getAdminStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const totalProperties = adminProperties.length;
      const verifiedProperties = adminProperties.filter((p) => p.verified).length;
      const featuredProperties = adminProperties.filter((p) => p.featured).length;
      const totalUsers = adminUsers.length;
      const totalInquiries = adminInquiries.length;
      const totalViews = adminProperties.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);

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
        properties: adminProperties,
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
      const prop = adminProperties.find((p) => p._id === id);
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
      const prop = adminProperties.find((p) => p._id === id);
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
      adminProperties = adminProperties.filter((p) => p._id !== id);
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
      res.status(200).json({ success: true, users: adminUsers });
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
      res.status(200).json({ success: true, inquiries: adminInquiries });
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
