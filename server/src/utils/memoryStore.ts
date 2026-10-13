import { fallbackProperties, SampleProperty } from './sampleData';

export interface MemoryUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: 'buyer' | 'owner' | 'agent' | 'admin';
  savedProperties: string[];
  createdAt: string;
}

export interface MemoryInquiry {
  _id: string;
  property: string | any;
  propertyTitle?: string;
  propertyId?: string;
  user?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferredVisitDate?: string;
  status: string;
  createdAt: string;
}

export const memoryProperties: SampleProperty[] = [...fallbackProperties];

// Default accounts covering all 3 personas: Admin, Seller (Owner/Agent), and Buyer
export const memoryUsers: MemoryUser[] = [
  {
    _id: 'admin-001',
    name: 'Ramlogics Real Estate Admin',
    email: 'admin@ramlogics.com',
    password: 'Password@123',
    phone: '+91 99999 88888',
    role: 'admin',
    savedProperties: [],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'seller-001',
    name: 'Rohit Sharma (Property Owner)',
    email: 'seller@ramlogics.com',
    password: 'Password@123',
    phone: '+91 98200 12345',
    role: 'owner',
    savedProperties: [],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'agent-001',
    name: 'Vikram Malhotra (Realty Consultant)',
    email: 'agent@ramlogics.com',
    password: 'Password@123',
    phone: '+91 99100 45678',
    role: 'agent',
    savedProperties: [],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'buyer-001',
    name: 'Amit Patel (Home Buyer)',
    email: 'buyer@ramlogics.com',
    password: 'Password@123',
    phone: '+91 98211 44556',
    role: 'buyer',
    savedProperties: ['sample-prop-01', 'sample-prop-03'],
    createdAt: new Date().toISOString(),
  },
];

// Set owner on sample properties
if (memoryProperties[0]) (memoryProperties[0] as any).owner = 'seller-001';
if (memoryProperties[1]) (memoryProperties[1] as any).owner = 'seller-001';
if (memoryProperties[2]) (memoryProperties[2] as any).owner = 'agent-001';
if (memoryProperties[3]) (memoryProperties[3] as any).owner = 'agent-001';
if (memoryProperties[4]) (memoryProperties[4] as any).owner = 'seller-001';

export const memoryInquiries: MemoryInquiry[] = [
  {
    _id: 'inq-001',
    property: memoryProperties[0],
    propertyTitle: memoryProperties[0]?.title || 'Luxury 3 BHK Sea View Apartment in Worli',
    propertyId: memoryProperties[0]?._id || 'sample-prop-01',
    user: 'buyer-001',
    name: 'Amit Patel',
    phone: '+91 98211 44556',
    email: 'amit.patel@gmail.com',
    message: 'Looking to schedule a weekend site visit with family.',
    status: 'new',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    _id: 'inq-002',
    property: memoryProperties[1],
    propertyTitle: memoryProperties[1]?.title || 'Spacious 2 BHK Apartment for Rent in Koramangala',
    propertyId: memoryProperties[1]?._id || 'sample-prop-02',
    user: 'buyer-001',
    name: 'Deepak Rao',
    phone: '+91 98765 11223',
    email: 'deepak.rao@infosys.com',
    message: 'Is the apartment available for immediate lease?',
    status: 'contacted',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    _id: 'inq-003',
    property: memoryProperties[2],
    propertyTitle: memoryProperties[2]?.title || 'Modern 4 BHK Independent Villa in Golf Course Road',
    propertyId: memoryProperties[2]?._id || 'sample-prop-03',
    name: 'Siddharth Jain',
    phone: '+91 99110 99887',
    email: 'siddharth@jainholdings.com',
    message: 'Interested in making an offer. Please share payment schedule.',
    status: 'scheduled',
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
  },
];
