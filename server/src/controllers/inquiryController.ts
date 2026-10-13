import { Request, Response } from 'express';
import { Inquiry } from '../models/Inquiry';
import { Property } from '../models/Property';
import { AuthRequest } from '../middleware/auth';

export const createInquiry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { propertyId, name, email, phone, message, preferredVisitDate } = req.body;

    if (!propertyId || !name || !email || !phone) {
      res.status(400).json({ success: false, message: 'Please provide all required fields' });
      return;
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found' });
      return;
    }

    const inquiry = await Inquiry.create({
      property: propertyId,
      user: req.user?._id,
      name,
      email,
      phone,
      message: message || 'I am interested in this property. Please contact me.',
      preferredVisitDate: preferredVisitDate ? new Date(preferredVisitDate) : undefined,
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully! The owner/agent will contact you shortly.',
      inquiry,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getPropertyInquiries = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { propertyId } = req.params;
    const property = await Property.findById(propertyId);

    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found' });
      return;
    }

    if (property.owner.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Not authorized' });
      return;
    }

    const inquiries = await Inquiry.find({ property: propertyId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: inquiries.length, inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getMyInquiries = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // If user is owner/agent, get inquiries on properties they own
    const myProperties = await Property.find({ owner: req.user?._id }).select('_id');
    const propertyIds = myProperties.map((p) => p._id);

    const receivedInquiries = await Inquiry.find({ property: { $in: propertyIds } })
      .populate('property', 'title location price listingType photos')
      .sort({ createdAt: -1 });

    const sentInquiries = await Inquiry.find({ user: req.user?._id })
      .populate('property', 'title location price listingType photos contactPhone contactName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      received: receivedInquiries,
      sent: sentInquiries,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
