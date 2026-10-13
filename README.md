# Ramlogics Realty - Real Estate Marketplace (MERN Stack)

A modern, full-stack Real Estate Marketplace platform inspired by **99acres** and **MagicBricks**, built using TypeScript, MongoDB Atlas / Mongoose, Express.js, React (Vite), and Tailwind CSS.

---

## 🌟 Key Features

### 🏢 Real Estate Property Catalog & Search
- **99acres / MagicBricks-Style Tabbed Search**: Buy (Resale), Rent / Lease, Commercial Properties, and Plots / Land.
- **Multi-Facet Search & Filtering**:
  - Filter by City (Mumbai, Bangalore, Delhi NCR, Pune, Gurgaon, etc.) and Locality.
  - Price Range (Min/Max ₹).
  - BHK Configuration (1 BHK, 2 BHK, 3 BHK, 4+ BHK).
  - Property Type (Apartment, Independent Villa, Floor, Office Space, Commercial Shop, Plot).
  - Furnishing status (Furnished, Semi-Furnished, Unfurnished).
  - Possession status (Ready to Move, Under Construction).
  - Dynamic Sorting (Price Low-to-High, High-to-Low, Newest First, Most Popular).
- **Responsive Layout**: Desktop sidebar filters with collapsible mobile filter drawer.

### 🏠 Property Details Page
- High-resolution image gallery with thumbnails and main photo viewer.
- Price display in Indian Numbering Format (₹ Lakhs and ₹ Crores).
- Price per sq.ft computation and Monthly EMI calculator.
- Key Specifications matrix (Bedrooms, Bathrooms, Balconies, Carpet Area, Super Area, Floor No, Facing, Possession).
- Verified Amenities checklist with icons (Gym, Pool, Lift, Parking, Power Backup, 24x7 Security, etc.).
- Direct Lead Generation & Contact Owner form with instant modal dialog.

### 📝 Post Property (Free & Zero Brokerage Listing)
- Step-by-step listing wizard for Owners and Agents.
- Basic info, Location hierarchy (City, Locality, Address, Pincode, State).
- Specifications & Area measurements.
- Interactive Amenities selector.
- Image uploads support (drag-and-drop or multiple photo URLs).
- Pricing, Maintenance, and Security Deposit settings.

### 👤 User Authentication & Lead Dashboard
- JWT-based authentication with bcrypt password hashing.
- Role support: `buyer`, `owner`, `agent`, `admin`.
- User Dashboard:
  - **My Listings**: Manage, view, and delete active properties.
  - **Inquiries / Leads**: Real-time leads received from interested buyers/tenants with phone numbers, emails, and messages.
  - **Saved Wishlist**: Properties saved for future review.

### ⚡ Offline & Staging Fallback
- The client comes with an authentic 5-property mock dataset representing luxury and affordable properties across Mumbai, Bangalore, Gurgaon, Pune, and Delhi.
- If the backend or MongoDB is not yet connected, the frontend seamlessly operates in preview mode with live search and filtering.

---

## 🏗️ Architecture & Tech Stack

| Tier | Technologies |
|------|-------------|
| **Frontend** | React 18, Vite 5, TypeScript, Tailwind CSS, Lucide Icons, Axios, React Router v6 |
| **Backend** | Node.js (v18+), Express.js, TypeScript, Mongoose, JWT, Multer, Morgan, CORS |
| **Database** | MongoDB / MongoDB Atlas with geospatial 2dsphere and text indices |
| **Tooling** | Concurrently, TypeScript (`tsc`), Rimraf |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.16.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster connection string.

### 2. Installation
Open your terminal in the project root:

```bash
cd C:\Users\Admin\source\real-estate-marketplace

# Install root, server, and client dependencies
npm run install-all
```

### 3. Environment Configuration
Backend environment file is configured in `server/.env`. You can edit it or copy from `.env.example`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB Atlas or Local connection string:
MONGO_URI=mongodb://127.0.0.1:27017/real_estate_marketplace
# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/real_estate_marketplace?retryWrites=true&w=majority

JWT_SECRET=ramlogics_real_estate_secret_key_2025
JWT_EXPIRES_IN=30d
```

### 4. Seed Initial Properties (Optional)
To populate sample verified listings into your MongoDB database:

```bash
npm run seed
```

### 5. Run Development Servers
Start both backend (Express on port 5000) and frontend (Vite on port 5173) simultaneously:

```bash
npm run dev
```

Visit the application in your browser:
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 6. Production Build
To compile TypeScript and bundle assets for both frontend and backend:

```bash
npm run build
```

---

## 📁 Project Structure

```text
real-estate-marketplace/
├── package.json               # Root orchestrator (scripts: dev, build, seed)
├── README.md                  # Project overview and setup instructions
├── .gitignore
├── server/                    # Express + TypeScript Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts          # MongoDB connection handler
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── propertyController.ts
│   │   │   └── inquiryController.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts        # JWT verification middleware
│   │   │   └── upload.ts      # Multer file upload setup
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Property.ts    # Rich real estate schema with text search
│   │   │   └── Inquiry.ts     # Lead inquiries schema
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── propertyRoutes.ts
│   │   │   ├── inquiryRoutes.ts
│   │   │   └── uploadRoutes.ts
│   │   ├── utils/
│   │   │   └── seedData.ts    # Seed script with realistic properties
│   │   └── index.ts           # Express server entry point
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
└── client/                    # React 18 + Vite + Tailwind Frontend
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.tsx
    │   │   ├── Footer.tsx
    │   │   ├── HeroSearch.tsx # 99acres-style tabbed search
    │   │   ├── PropertyCard.tsx
    │   │   └── InquiryModal.tsx
    │   ├── pages/
    │   │   ├── Home.tsx
    │   │   ├── PropertyList.tsx  # Catalog with sidebar filters
    │   │   ├── PropertyDetail.tsx # Specs, gallery & lead capture
    │   │   ├── PostProperty.tsx   # Comprehensive listing wizard
    │   │   ├── Dashboard.tsx      # Leads & listings management
    │   │   ├── Login.tsx
    │   │   └── Register.tsx
    │   ├── context/
    │   │   └── AuthContext.tsx
    │   ├── services/
    │   │   └── api.ts         # Axios client + offline mock fallback
    │   ├── types/
    │   │   └── index.ts       # Shared TypeScript interfaces
    │   ├── utils/
    │   │   └── format.ts      # Indian Currency & number formatters
    │   ├── App.tsx
    │   └── main.tsx
    ├── vite.config.ts
    ├── tailwind.config.js
    └── package.json
```

---

## 🔒 API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register buyer, owner, or agent | No |
| `POST` | `/api/auth/login` | User login & JWT issuance | No |
| `GET`  | `/api/auth/me` | Fetch logged-in user profile | Yes (Bearer Token) |
| `GET`  | `/api/properties` | Search & filter property catalog | No |
| `GET`  | `/api/properties/:id` | Get detailed property specifications | No |
| `POST` | `/api/properties` | Post new property listing | Yes (Bearer Token) |
| `PUT`  | `/api/properties/:id` | Update owned property listing | Yes (Bearer Token) |
| `DELETE`| `/api/properties/:id` | Remove property listing | Yes (Bearer Token) |
| `GET`  | `/api/properties/my-listings` | Get user's published listings | Yes (Bearer Token) |
| `POST` | `/api/inquiries` | Submit inquiry / schedule site visit | No |
| `GET`  | `/api/inquiries/received` | Get leads received for owned properties | Yes (Bearer Token) |
| `POST` | `/api/upload` | Upload photos (supports multiple) | Yes (Bearer Token) |

---

## 📄 License
ISC © Ramlogics
