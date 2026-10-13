import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Property, IProperty } from '../models/Property';
import { AuthRequest } from '../middleware/auth';
import { memoryProperties } from '../utils/memoryStore';

export const getProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      keyword,
      listingType,
      city,
      locality,
      propertyType,
      minPrice,
      maxPrice,
      bedrooms,
      furnishing,
      possessionStatus,
      amenities,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    // Fallback when MongoDB is not connected
    if (mongoose.connection.readyState !== 1) {
      let results = [...memoryProperties];

      if (listingType && listingType !== 'all') {
        results = results.filter((p) => p.listingType === listingType);
      }
      if (city && city !== 'all') {
        results = results.filter((p) => p.location.city.toLowerCase().includes(String(city).toLowerCase()));
      }
      if (locality) {
        results = results.filter((p) => p.location.locality.toLowerCase().includes(String(locality).toLowerCase()));
      }
      if (propertyType && propertyType !== 'all') {
        results = results.filter((p) => p.propertyType === propertyType);
      }
      if (minPrice) {
        results = results.filter((p) => p.price >= Number(minPrice));
      }
      if (maxPrice) {
        results = results.filter((p) => p.price <= Number(maxPrice));
      }
      if (bedrooms && bedrooms !== 'all') {
        const bhk = Number(bedrooms);
        results = results.filter((p) => (bhk >= 4 ? p.features.bedrooms >= 4 : p.features.bedrooms === bhk));
      }
      if (furnishing && furnishing !== 'all') {
        results = results.filter((p) => p.features.furnishing === furnishing);
      }
      if (possessionStatus && possessionStatus !== 'all') {
        results = results.filter((p) => p.features.possessionStatus === possessionStatus);
      }
      if (keyword) {
        const kw = String(keyword).toLowerCase();
        results = results.filter((p) =>
          p.title.toLowerCase().includes(kw) ||
          p.description.toLowerCase().includes(kw) ||
          p.location.locality.toLowerCase().includes(kw) ||
          p.location.city.toLowerCase().includes(kw)
        );
      }

      if (sort === 'price_asc') results.sort((a, b) => a.price - b.price);
      else if (sort === 'price_desc') results.sort((a, b) => b.price - a.price);
      else if (sort === 'popularity') results.sort((a, b) => b.viewsCount - a.viewsCount);

      res.status(200).json({
        success: true,
        count: results.length,
        total: results.length,
        totalPages: 1,
        currentPage: 1,
        properties: results,
      });
      return;
    }

    const query: any = { status: 'active' };

    // Listing Type (buy / rent / commercial / plot)
    if (listingType && listingType !== 'all') {
      query.listingType = listingType;
    }

    // City & Locality Filter
    if (city && city !== 'all') {
      query['location.city'] = { $regex: new RegExp(String(city), 'i') };
    }
    if (locality) {
      query['location.locality'] = { $regex: new RegExp(String(locality), 'i') };
    }

    // Property Type
    if (propertyType && propertyType !== 'all') {
      query.propertyType = propertyType;
    }

    // Price Range Filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Bedrooms / BHK
    if (bedrooms && bedrooms !== 'all') {
      const bhkList = String(bedrooms).split(',').map(Number);
      if (bhkList.includes(4)) {
        query['features.bedrooms'] = { $gte: 4 };
      } else {
        query['features.bedrooms'] = { $in: bhkList };
      }
    }

    // Furnishing
    if (furnishing && furnishing !== 'all') {
      query['features.furnishing'] = furnishing;
    }

    // Possession Status
    if (possessionStatus && possessionStatus !== 'all') {
      query['features.possessionStatus'] = possessionStatus;
    }

    // Amenities Filter
    if (amenities) {
      const amenityArray = String(amenities).split(',');
      query.amenities = { $all: amenityArray };
    }

    // Keyword / Text Search
    if (keyword) {
      const regex = new RegExp(String(keyword), 'i');
      query.$or = [
        { title: regex },
        { description: regex },
        { 'location.city': regex },
        { 'location.locality': regex },
        { 'location.address': regex },
        { propertyType: regex },
      ];
    }

    // Sorting
    let sortOption: any = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'popularity') sortOption = { viewsCount: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .populate('owner', 'name phone email');

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      properties,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getFeaturedProperties = async (_req: Request, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const featured = memoryProperties.filter((p) => p.featured);
      res.status(200).json({ success: true, properties: featured });
      return;
    }

    const featured = await Property.find({ featured: true, status: 'active' })
      .limit(8)
      .populate('owner', 'name phone email');

    res.status(200).json({ success: true, properties: featured });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getPropertyById = async (req: Request, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const property = memoryProperties.find((p) => p._id === req.params.id) || memoryProperties[0];
      if (!property) {
        res.status(404).json({ success: false, message: 'Property not found' });
        return;
      }
      const similar = memoryProperties.filter((p) => p._id !== property._id).slice(0, 3);
      res.status(200).json({ success: true, property, similar });
      return;
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewsCount: 1 } },
      { new: true }
    ).populate('owner', 'name phone email avatar');

    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found' });
      return;
    }

    // Find similar properties in same city or listing type
    const similar = await Property.find({
      _id: { $ne: property._id },
      'location.city': property.location.city,
      listingType: property.listingType,
      status: 'active',
    }).limit(4);

    res.status(200).json({ success: true, property, similar });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const createProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const propertyData = {
      ...req.body,
      owner: req.user._id,
      contactName: req.body.contactName || req.user.name,
      contactPhone: req.body.contactPhone || req.user.phone,
      contactEmail: req.body.contactEmail || req.user.email,
    };

    if (mongoose.connection.readyState !== 1) {
      const newProp = {
        ...propertyData,
        _id: 'prop_' + Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      memoryProperties.unshift(newProp);
      res.status(201).json({
        success: true,
        message: 'Property listed successfully!',
        property: newProp,
      });
      return;
    }

    const property = await Property.create(propertyData);

    res.status(201).json({
      success: true,
      message: 'Property listed successfully!',
      property,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const updateProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const idx = memoryProperties.findIndex((p: any) => p._id === req.params.id);
      if (idx === -1) {
        res.status(404).json({ success: false, message: 'Property not found' });
        return;
      }
      const existing = memoryProperties[idx];
      const ownerId = (existing as any).owner?._id || (existing as any).owner;
      if (String(ownerId) !== String(req.user?._id) && req.user?.role !== 'admin') {
        res.status(403).json({ success: false, message: 'Not authorized to edit this property' });
        return;
      }
      memoryProperties[idx] = { ...existing, ...req.body, updatedAt: new Date().toISOString() };
      res.status(200).json({
        success: true,
        message: 'Property updated successfully',
        property: memoryProperties[idx],
      });
      return;
    }

    let property = await Property.findById(req.params.id);

    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found' });
      return;
    }

    // Check ownership or admin
    if (property.owner.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Not authorized to edit this property' });
      return;
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      property,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const deleteProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const idx = memoryProperties.findIndex((p: any) => p._id === req.params.id);
      if (idx === -1) {
        res.status(404).json({ success: false, message: 'Property not found' });
        return;
      }
      const existing = memoryProperties[idx];
      const ownerId = (existing as any).owner?._id || (existing as any).owner;
      if (String(ownerId) !== String(req.user?._id) && req.user?.role !== 'admin') {
        res.status(403).json({ success: false, message: 'Not authorized to delete this property' });
        return;
      }
      memoryProperties.splice(idx, 1);
      res.status(200).json({ success: true, message: 'Property removed successfully' });
      return;
    }

    const property = await Property.findById(req.params.id);

    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found' });
      return;
    }

    if (property.owner.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Not authorized to delete this property' });
      return;
    }

    await Property.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Property removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getMyProperties = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const userId = String(req.user?._id);
      const props = memoryProperties.filter((p: any) => {
        const ownerId = p.owner?._id || p.owner;
        return String(ownerId) === userId;
      });
      res.status(200).json({ success: true, count: props.length, properties: props });
      return;
    }

    const properties = await Property.find({ owner: req.user?._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: properties.length, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
