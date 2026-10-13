export type ListingType = 'buy' | 'rent' | 'commercial' | 'plot';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'buyer' | 'agent' | 'owner' | 'admin';
  savedProperties: string[];
}

export interface Property {
  _id: string;
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
    availableFrom?: string;
  };
  amenities: string[];
  photos: string[];
  floorPlanUrl?: string;
  owner: {
    _id: string;
    name: string;
    phone: string;
    email: string;
    avatar?: string;
  };
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  featured: boolean;
  verified: boolean;
  viewsCount: number;
  status: 'active' | 'sold' | 'rented' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Inquiry {
  _id: string;
  property: Property;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferredVisitDate?: string;
  status: 'new' | 'contacted' | 'visit_scheduled' | 'closed';
  createdAt: string;
}

export interface FilterState {
  keyword: string;
  listingType: ListingType | 'all';
  city: string;
  locality: string;
  propertyType: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms: string;
  furnishing: string;
  possessionStatus: string;
  amenities: string[];
  sort: string;
  page: number;
}
