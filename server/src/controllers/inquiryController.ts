import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Inquiry } from '../models/Inquiry';
import { Property } from '../models/Property';
import { AuthRequest } from '../middleware/auth';
import { memoryInquiries, memoryProperties } from '../utils/memoryStore';

export const createInquiry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { propertyId, name, email, phone, message, preferredVisitDate } = req.body;

    if (!propertyId || !name || !email || !phone) {
      res.status(400).json({ success: false, message: 'Please provide all required fields' });
      return;
    }

    if (mongoose.connection.readyState !== 1) {
      const prop = memoryProperties.find((p: any) => p._id === propertyId);
      if (!prop) {
        res.status(404).json({ success: false, message: 'Property not found' });
        return;
      }

      const newInq = {
        _id: 'inq_' + Date.now(),
        property: prop,
        user: req.user?._id || 'guest',
        name,
        email,
        phone,
        message: message || 'I am interested in this property. Please contact me.',
        preferredVisitDate: preferredVisitDate ? new Date(preferredVisitDate).toISOString() : undefined,
        status: 'new',
        createdAt: new Date().toISOString(),
      };

      memoryInquiries.unshift(newInq);

      res.status(201).json({
        success: true,
        message: 'Inquiry submitted successfully! The owner/agent will contact you shortly.',
        inquiry: newInq,
      });
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

    if (mongoose.connection.readyState !== 1) {
      const prop = memoryProperties.find((p: any) => p._id === propertyId);
      if (!prop) {
        res.status(404).json({ success: false, message: 'Property not found' });
        return;
      }
      const ownerId = (prop as any).owner?._id || (prop as any).owner;
      if (String(ownerId) !== String(req.user?._id) && req.user?.role !== 'admin') {
        res.status(403).json({ success: false, message: 'Not authorized' });
        return;
      }

      const inqs = memoryInquiries.filter(
        (i: any) => (i.property?._id || i.property) === propertyId
      );
      res.status(200).json({ success: true, count: inqs.length, inquiries: inqs });
      return;
    }

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
    if (mongoose.connection.readyState !== 1) {
      const userId = String(req.user?._id);

      // Find properties owned by this user
      const ownedPropertyIds = new Set(
        memoryProperties
          .filter((p: any) => String(p.owner?._id || p.owner) === userId)
          .map((p: any) => p._id)
      );

      const received = memoryInquiries.filter((inq: any) => {
        const propId = inq.property?._id || inq.property;
        return ownedPropertyIds.has(propId);
      });

      const sent = memoryInquiries.filter((inq: any) => String(inq.user) === userId);

      res.status(200).json({
        success: true,
        received,
        sent,
      });
      return;
    }

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
