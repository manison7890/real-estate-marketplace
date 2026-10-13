import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { User } from '../models/User';
import { Property } from '../models/Property';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const sampleProperties = [
  {
    title: 'Luxury 3 BHK Sea View Apartment in Worli',
    description: 'Ultra-luxurious 3 BHK high-rise residence overlooking the Arabian Sea. Designed with Italian marble flooring, expansive master suite, private deck, and state-of-the-art home automation.',
    listingType: 'buy',
    propertyType: 'Apartment',
    price: 65000000, // 6.5 Cr
    priceNegotiable: true,
    maintenanceCharges: 18000,
    location: {
      address: 'Floor 32, Lodha Bellissimo, NM Joshi Marg',
      locality: 'Worli',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400018',
    },
    features: {
      bedrooms: 3,
      bathrooms: 3,
      balconies: 2,
      carpetAreaSqFt: 1850,
      superAreaSqFt: 2400,
      furnishing: 'Furnished',
      floorNo: 32,
      totalFloors: 48,
      facing: 'West',
      possessionStatus: 'Ready to Move',
    },
    amenities: ['Lift', 'Swimming Pool', 'Gymnasium', 'Covered Parking', 'Club House', 'Power Backup', 'Security / Fire Alarm', 'Intercom'],
    photos: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    ],
    contactName: 'Rohit Sharma (Ramlogics Premier)',
    contactPhone: '+91 98200 12345',
    contactEmail: 'rohit@ramlogics.com',
    featured: true,
    verified: true,
    viewsCount: 342,
  },
  {
    title: 'Spacious 2 BHK Apartment for Rent in Koramangala',
    description: 'Bright and airy 2 BHK flat located in prime Koramangala 4th Block. Walking distance from major tech parks, restaurants, and supermarkets. Ideal for tech professionals and small families.',
    listingType: 'rent',
    propertyType: 'Apartment',
    price: 45000, // 45k / month
    priceNegotiable: false,
    maintenanceCharges: 3500,
    location: {
      address: '80 Feet Road, 4th Block',
      locality: 'Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      pinCode: '560034',
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      balconies: 1,
      carpetAreaSqFt: 1150,
      superAreaSqFt: 1350,
      furnishing: 'Semi-Furnished',
      floorNo: 3,
      totalFloors: 5,
      facing: 'East',
      possessionStatus: 'Ready to Move',
    },
    amenities: ['Lift', 'Covered Parking', 'Power Backup', 'Security / Fire Alarm', 'Water Storage'],
    photos: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    ],
    contactName: 'Priya Nair',
    contactPhone: '+91 98450 67890',
    contactEmail: 'priya.nair@gmail.com',
    featured: true,
    verified: true,
    viewsCount: 198,
  },
  {
    title: 'Modern 4 BHK Independent Villa in Golf Course Road',
    description: 'Magnificent 4 BHK standalone villa with landscaped private lawn, modular kitchen, home theatre room, and dedicated servant quarters in a gated community.',
    listingType: 'buy',
    propertyType: 'Independent House / Villa',
    price: 125000000, // 12.5 Cr
    priceNegotiable: true,
    maintenanceCharges: 25000,
    location: {
      address: 'DLF Phase 5, Sector 54',
      locality: 'Golf Course Road',
      city: 'Gurgaon',
      state: 'Haryana',
      pinCode: '122002',
    },
    features: {
      bedrooms: 4,
      bathrooms: 5,
      balconies: 3,
      carpetAreaSqFt: 4200,
      superAreaSqFt: 5500,
      furnishing: 'Furnished',
      floorNo: 1,
      totalFloors: 3,
      facing: 'North-East',
      possessionStatus: 'Ready to Move',
    },
    amenities: ['Swimming Pool', 'Gymnasium', 'Covered Parking', 'Club House', 'Power Backup', 'Park / Garden', 'Security / Fire Alarm'],
    photos: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    ],
    contactName: 'Vikram Malhotra',
    contactPhone: '+91 99100 45678',
    contactEmail: 'vikram.realtors@gmail.com',
    featured: true,
    verified: true,
    viewsCount: 512,
  },
  {
    title: 'Grade-A Commercial Office Space in Hitec City',
    description: 'Fully furnished commercial plug-and-play office floor plate with 120 workstations, 4 executive cabins, 2 conference rooms, cafeteria, and high-speed fiber internet.',
    listingType: 'commercial',
    propertyType: 'Commercial Office',
    price: 320000, // 3.2 L / month
    priceNegotiable: true,
    maintenanceCharges: 45000,
    location: {
      address: 'Cyber Towers Annex, Mindspace IT Park',
      locality: 'Hitec City',
      city: 'Hyderabad',
      state: 'Telangana',
      pinCode: '500081',
    },
    features: {
      bedrooms: 0,
      bathrooms: 4,
      balconies: 0,
      carpetAreaSqFt: 5000,
      superAreaSqFt: 6200,
      furnishing: 'Furnished',
      floorNo: 7,
      totalFloors: 14,
      possessionStatus: 'Ready to Move',
    },
    amenities: ['Lift', 'Power Backup', 'Security / Fire Alarm', 'Covered Parking', 'Cafeteria', 'Central AC'],
    photos: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
    ],
    contactName: 'Sanjay Reddy',
    contactPhone: '+91 94400 98765',
    contactEmail: 'sanjay.cre@commercialspaces.com',
    featured: false,
    verified: true,
    viewsCount: 220,
  },
  {
    title: 'Gated Community Residential Plot in Hinjewadi',
    description: 'East-facing clear title NA residential plot inside a premium gated township. PMRDA approved with underground cabling, water connections, and wide bitumen roads.',
    listingType: 'plot',
    propertyType: 'Plot / Land',
    price: 7500000, // 75 Lakhs
    priceNegotiable: true,
    location: {
      address: 'Phase 3, Near Megapolis',
      locality: 'Hinjewadi',
      city: 'Pune',
      state: 'Maharashtra',
      pinCode: '411057',
    },
    features: {
      bedrooms: 0,
      bathrooms: 0,
      balconies: 0,
      carpetAreaSqFt: 2400,
      superAreaSqFt: 2400,
      furnishing: 'Unfurnished',
      possessionStatus: 'Ready to Move',
    },
    amenities: ['Club House', 'Park / Garden', 'Security / Fire Alarm', 'Water Storage'],
    photos: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524813686514-a57563d77d66?auto=format&fit=crop&w=1200&q=80',
    ],
    contactName: 'Anand Kulkarni',
    contactPhone: '+91 97650 11223',
    contactEmail: 'anand.plots@gmail.com',
    featured: false,
    verified: true,
    viewsCount: 140,
  },
];

async function seed() {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/real_estate_marketplace';
    await mongoose.connect(connUri);
    console.log('Connected to MongoDB for seeding...');

    let adminUser = await User.findOne({ email: 'admin@ramlogics.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Ramlogics Real Estate Admin',
        email: 'admin@ramlogics.com',
        password: 'Password@123',
        phone: '+91 99999 88888',
        role: 'admin',
      });
      console.log('Created admin user: admin@ramlogics.com');
    }

    await Property.deleteMany({});
    console.log('Cleared existing properties');

    const propertiesToInsert = sampleProperties.map((p) => ({
      ...p,
      owner: adminUser!._id,
    }));

    await Property.insertMany(propertiesToInsert);
    console.log(`Seeded ${propertiesToInsert.length} properties successfully!`);

    await mongoose.disconnect();
    console.log('Seeding completed and disconnected.');
  } catch (error) {
    console.error('Seeding error:', error);
  }
}

seed();
