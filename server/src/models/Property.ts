import mongoose, { Document, Schema, Types } from 'mongoose';

export type ListingType = 'buy' | 'rent' | 'commercial' | 'plot';

export interface IProperty extends Document {
  title: string;
  description: string;
  listingType: ListingType;
  propertyType: string;
  price: number;
  priceNegotiable: boolean;
  maintenanceCharges?: number;
  location: {
    address: string;
    locality: string;
    city: string;
    state: string;
    pinCode: string;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    balconies: number;
    carpetAreaSqFt: number;
    superAreaSqFt?: number;
    furnishing: 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
    floorNo?: number;
    totalFloors?: number;
    facing?: string;
    possessionStatus?: 'Ready to Move' | 'Under Construction';
    availableFrom?: Date;
  };
  amenities: string[];
  photos: string[];
  floorPlanUrl?: string;
  owner: Types.ObjectId;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  featured: boolean;
  verified: boolean;
  viewsCount: number;
  status: 'active' | 'sold' | 'rented' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    listingType: {
      type: String,
      enum: ['buy', 'rent', 'commercial', 'plot'],
      required: true,
      index: true,
    },
    propertyType: { type: String, required: true, index: true },
    price: { type: Number, required: true, index: true },
    priceNegotiable: { type: Boolean, default: false },
    maintenanceCharges: { type: Number, default: 0 },
    location: {
      address: { type: String, required: true },
      locality: { type: String, required: true, index: true },
      city: { type: String, required: true, index: true },
      state: { type: String, required: true },
      pinCode: { type: String, required: true },
    },
    features: {
      bedrooms: { type: Number, default: 1, index: true },
      bathrooms: { type: Number, default: 1 },
      balconies: { type: Number, default: 0 },
      carpetAreaSqFt: { type: Number, required: true },
      superAreaSqFt: { type: Number },
      furnishing: {
        type: String,
        enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
        default: 'Semi-Furnished',
      },
      floorNo: { type: Number },
      totalFloors: { type: Number },
      facing: { type: String },
      possessionStatus: {
        type: String,
        enum: ['Ready to Move', 'Under Construction'],
        default: 'Ready to Move',
      },
      availableFrom: { type: Date, default: Date.now },
    },
    amenities: [{ type: String }],
    photos: [{ type: String }],
    floorPlanUrl: { type: String, default: '' },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    contactName: { type: String, required: true },
    contactPhone: { type: String, required: true },
    contactEmail: { type: String, required: true },
    featured: { type: Boolean, default: false, index: true },
    verified: { type: Boolean, default: false },
    viewsCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['active', 'sold', 'rented', 'inactive'],
      default: 'active',
      index: true,
    },
  },
  { timestamps: true }
);

// Text search index for 99acres style location/title keywords
PropertySchema.index({
  title: 'text',
  description: 'text',
  'location.city': 'text',
  'location.locality': 'text',
  'location.address': 'text',
});

export const Property = mongoose.model<IProperty>('Property', PropertySchema);
