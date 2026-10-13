# Ramlogics Real Estate Marketplace
## Technical Architecture, Functional Specifications & Confluence Documentation

---

## 1. Document Control & Metadata

| Metadata Field | Details |
| :--- | :--- |
| **Document Title** | Ramlogics Real Estate Marketplace — Technical Architecture, Functional Specifications & Platform Guide |
| **Project Name** | Ramlogics Real Estate (`real-estate-marketplace`) |
| **Client / Organization** | Ramlogics Technologies ([www.ramlogics.com](https://www.ramlogics.com)) |
| **Author / Team** | Full-Stack Engineering & Technical Operations Team |
| **Technology Stack** | MERN + TypeScript (React 18, Vite, Tailwind CSS, Node.js 18, Express 4.19, MongoDB / Mongoose) |
| **Architecture Mode** | Dual-Mode Architecture (MongoDB Atlas Cloud DB + In-Memory Fallback Engine) |
| **Current Status** | Complete / Verified Live / Production Ready |
| **GitHub Repository** | [https://github.com/technical-channel/real-estate-marketplace](https://github.com/technical-channel/real-estate-marketplace) |
| **Backup / Mirror** | [https://github.com/manison7890/real-estate-marketplace](https://github.com/manison7890/real-estate-marketplace) |
| **Primary Branches** | `main`, `master` |
| **Collaborators** | `technical-channel` (Owner), `manison7890` (Collaborator - Push Access) |

---

## 2. Executive Summary

**Ramlogics Real Estate Marketplace** is a comprehensive, production-grade property portal engineered to rival premier Indian real estate platforms such as **99acres** and **MagicBricks**. Designed and themed around the official corporate visual identity of **Ramlogics** (featuring the brand green `#84bd2f`, charcoal dark `#060606`, and official brand assets), the platform seamlessly connects home buyers, tenants, property owners, and real estate agents across tier-1 Indian metros.

### Key Platform Highlights
1. **Multi-Role Architecture:** Native support for three primary user personas:
   - **Home Buyers & Tenants:** Intuitive catalog search, rich filtering, interactive property specifications, lead submission, and personalized wishlists.
   - **Sellers & Real Estate Agents:** Free listing wizard (`/post-property`), self-service listing management, impression counters, and real-time buyer lead capture.
   - **Website Owner Super Admin:** Centralized moderation command center (`/admin`), platform KPI metrics, one-click RERA verification toggles, promotional featured toggles, listing deletion, user registry, and customer care inquiry inbox.
2. **Dual-Mode Persistence Layer:**
   - **Live MongoDB Production:** Seamless Mongoose connectivity when `MONGO_URI` is provided in environment variables.
   - **Automatic In-Memory Synchronized Store:** When running without a local MongoDB service or in disconnected staging environments, the platform automatically routes operations through an in-memory transactional store (`memoryStore.ts`), ensuring 100% of features (authentication, property CRUD, search, lead tracking) remain fully operational.
3. **Responsive Corporate Design:** Tailored with Tailwind CSS using the exact Ramlogics brand green palette (`#84bd2f`), high-resolution typography, and mobile-friendly responsive breakpoints.

---

## 3. Technology Stack & System Architecture

### 3.1 Component Breakdown

| Layer | Technology | Version | Purpose & Implementation |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React + TypeScript | 18.3.1 | Single-Page Application (SPA) with declarative components and type safety |
| **Frontend Tooling** | Vite | 5.4.21 | Ultra-fast HMR, ES module bundling, and optimized production builds |
| **Styling & Theme** | Tailwind CSS | 3.4.4 | Utility-first styling with custom Ramlogics green palette (`#84bd2f`) |
| **Icons & Assets** | Lucide React | 0.395.0 | Modern SVG icon set |
| **HTTP Client** | Axios | 1.7.2 | RESTful API client with JWT interceptors |
| **Backend Runtime** | Node.js | 18.16.1 | Cross-platform JavaScript runtime engine |
| **Server Framework** | Express | 4.19.2 | RESTful API routing, middleware chaining, and static serving |
| **Security & Auth** | JSON Web Tokens & bcryptjs | 9.0.2 / 2.4.3 | Stateless JWT authentication with Bearer token authorization headers |
| **Database ODM** | Mongoose | 8.4.1 | Schema definition, validation, and MongoDB Atlas queries |
| **Staging Store** | In-Memory Engine (`memoryStore.ts`) | Custom | Real-time dual-mode memory store fallback for offline staging |

### 3.2 System Architecture Flow

```
                      +---------------------------------------+
                      |         Web & Mobile Browsers         |
                      |   React 18 + Vite SPA (Port 5173)     |
                      +---------------------------------------+
                                          |
                                          | REST API / JSON (Axios)
                                          | Authorization: Bearer <JWT>
                                          v
                      +---------------------------------------+
                      |       Express.js Server (Port 5000)   |
                      |   - CORS Middleware                   |
                      |   - JWT Auth & Role Guard (`protect`) |
                      |   - Request Body Parsers              |
                      +---------------------------------------+
                                          |
                      +-------------------+-------------------+
                      |                                       |
        [If MongoDB Connected: readyState === 1]     [If Offline / Staging Fallback]
                      |                                       |
                      v                                       v
         +-------------------------+             +--------------------------+
         |     MongoDB Atlas       |             | In-Memory Data Store     |
         |  - Users Collection     |             |  (`utils/memoryStore.ts`)|
         |  - Properties Collection|             |  - memoryUsers           |
         |  - Inquiries Collection |             |  - memoryProperties      |
         +-------------------------+             |  - memoryInquiries       |
                                                 +--------------------------+
```

---

## 4. Multi-Role Modules & Functional Workflows

### 4.1 Buyer & Tenant Module
* **Search & Discovery (`/properties`):**
  - Search by transaction intent: **Buy**, **Rent**, **Commercial**, and **Plots / Land**.
  - City filters: Mumbai, Bangalore, Delhi NCR, Gurgaon, Noida, Pune, Hyderabad, and Chennai.
  - Granular criteria: BHK configuration (1, 2, 3, 4+ BHK), property type (Apartment, Independent Villa, Builder Floor, Plot, Office), furnishing status, and possession status (Ready to Move vs. Under Construction).
  - Sorting: Newest First, Price (Low to High), Price (High to Low), and Popularity.
* **Property Detail View (`/property/:id`):**
  - High-resolution gallery carousel with multi-image previews.
  - Quick specification chips: Carpet area, super area, floor number, facing direction, furnishing state, and maintenance charges.
  - Verified RERA badge and direct owner contact information.
  - Society & building amenities checklist (swimming pool, gym, clubhouse, power backup, parking).
* **Lead Generation & Callback Request:**
  - Integrated inline callback form and "Schedule In-Person Site Visit" modal dialog.
  - Automatically captures buyer name, phone, email, visit date, and custom inquiries.
  - Dispatches leads directly to the listing owner/agent and central admin dashboard.
* **Wishlist Management (`/dashboard?tab=wishlist`):**
  - One-click heart toggle to save and unsave properties.
  - Real-time synchronization across devices for authenticated accounts.

### 4.2 Seller & Real Estate Agent Module
* **Post Property Wizard (`/post-property`):**
  - 100% Free property listing workflow.
  - Pre-fills contact details from the authenticated profile (`name`, `phone`, `email`).
  - Input sections for location coordinates, unit dimensions, pricing, negotiation terms, amenities checklist, and high-resolution photo URLs.
  - Instant validation and automatic redirection to the live listing.
* **Seller Management Dashboard (`/dashboard`):**
  - **My Properties Tab:** View all active listings posted by the seller, complete with impression counters, quick links to public listings, and one-click removal.
  - **Buyer Inquiries Tab (`/dashboard?tab=inquiries`):** Centralized CRM lead inbox showing buyer name, contact numbers, email addresses, requested site visit dates, and one-click `Call Buyer Now` (`tel:`) buttons.

### 4.3 Website Owner Super Admin Module (`/admin`)
* **Executive KPI Dashboard:**
  - Real-time counters: Total Listings, RERA Verified Count, Active Lead Inquiries, Registered Platform Users, and Total Platform Impressions.
* **Property Moderation & Catalog Management:**
  - Comprehensive searchable directory of all listings across India.
  - Instant locality and title filter bar.
  - **One-Click RERA Verification Toggle:** Instantly toggle verified badges on or off.
  - **One-Click Featured Toggle:** Mark listings as Featured with golden star highlight.
  - **Administrative Deletion:** Remove spam, duplicate, or outdated listings immediately.
* **Lead Inquiry Center:**
  - Audit trail of all platform leads, categorized by property, status (`new`, `contacted`, `scheduled`), and timestamp.
  - Quick-action buttons to directly call or email prospective leads.
* **User & Agent Registry:**
  - Master user directory detailing names, contact info, platform roles (`admin`, `owner`, `agent`, `buyer`), and registration dates.

---

## 5. Pre-Configured Test Accounts & Credentials

The platform includes four pre-seeded accounts covering every role for immediate testing:

| Persona | Role | Email Address | Password | Permissions & Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Website Owner Admin** | `admin` | `admin@ramlogics.com` | `Password@123` | Full administrative control, KPI metrics, RERA verification, listing deletion, and lead oversight. |
| **Property Owner (Seller)** | `owner` | `seller@ramlogics.com` | `Password@123` | Free listing creation, seller dashboard, property management, and direct buyer lead tracking. |
| **Realty Consultant (Agent)** | `agent` | `agent@ramlogics.com` | `Password@123` | Multi-unit portfolio management and client lead handling. |
| **Home Buyer / Tenant** | `buyer` | `buyer@ramlogics.com` | `Password@123` | Catalog search, property detail view, lead inquiries, and saved wishlist. |

---

## 6. REST API Endpoints Specification

All endpoints are hosted under the base prefix `/api`:

### 6.1 Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Create new buyer, owner, or agent account |
| `POST` | `/api/auth/login` | Public | Authenticate user and issue JWT token |
| `GET` | `/api/auth/me` | Protected | Retrieve authenticated user profile and saved wishlist |
| `POST` | `/api/auth/wishlist/:id` | Protected | Toggle property ID in user's saved wishlist |

### 6.2 Property Catalog (`/api/properties`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/properties` | Public | Search properties with filters (city, type, BHK, price) |
| `GET` | `/api/properties/featured` | Public | Get curated featured properties for homepage |
| `GET` | `/api/properties/my-listings` | Protected | Get listings belonging to the authenticated seller |
| `GET` | `/api/properties/:id` | Public | Get single property details by ID |
| `POST` | `/api/properties` | Protected | Create and publish a new property listing |
| `PUT` | `/api/properties/:id` | Protected (Owner/Admin) | Update existing listing details |
| `DELETE` | `/api/properties/:id` | Protected (Owner/Admin) | Delete a property listing |

### 6.3 Lead Inquiries (`/api/inquiries`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/inquiries` | Public / Auth | Submit inquiry or schedule site visit |
| `GET` | `/api/inquiries/my-inquiries`| Protected | Get inquiries sent (buyer) and received (seller) |
| `GET` | `/api/inquiries/property/:id`| Protected (Owner) | Get inquiries on a specific property |

### 6.4 Admin Control Panel (`/api/admin`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Admin | Retrieve platform KPIs (listings, users, leads, views) |
| `GET` | `/api/admin/properties` | Admin | Retrieve all properties for moderation |
| `PATCH`| `/api/admin/properties/:id/verify` | Admin | Toggle RERA verification status |
| `PATCH`| `/api/admin/properties/:id/feature` | Admin | Toggle promotional featured status |
| `DELETE`| `/api/admin/properties/:id` | Admin | Permanently delete listing as administrator |
| `GET` | `/api/admin/users` | Admin | Retrieve registered user directory |
| `GET` | `/api/admin/inquiries` | Admin | Retrieve master lead inquiry log |

---

## 7. Repository Directory Structure

```
real-estate-marketplace/
├── package.json                    # Workspace root scripts (dev, build, start)
├── README.md                       # Quickstart documentation & setup guide
├── CONFLUENCE_DOCUMENTATION.md     # Confluence-ready technical documentation
│
├── client/                         # Frontend Application (React 18 + Vite)
│   ├── package.json                # Frontend dependencies
│   ├── vite.config.ts              # Vite config with /api and /uploads proxy
│   ├── tailwind.config.js          # Ramlogics brand green configuration
│   ├── index.html                  # HTML entry point with Ramlogics branding
│   ├── public/
│   │   ├── ramlogics-logo.png      # Official Ramlogics corporate logo
│   │   └── favicon.png             # Ramlogics brand favicon
│   └── src/
│       ├── App.tsx                 # Route declarations & App layout
│       ├── main.tsx                # React DOM entry point
│       ├── types/                  # TypeScript interface declarations
│       ├── services/api.ts         # Axios client and mock catalog fallback
│       ├── context/AuthContext.tsx # Global authentication & wishlist state
│       ├── components/             # Reusable UI components
│       │   ├── Navbar.tsx          # Top navigation with Ramlogics logo & auth state
│       │   ├── Footer.tsx          # Corporate footer with quick links & support
│       │   ├── HeroSearch.tsx      # Multi-tab search bar (Buy, Rent, Commercial, Plot)
│       │   ├── PropertyCard.tsx    # Responsive listing card with specs & wishlist
│       │   └── InquiryModal.tsx    # Modal for site visit scheduling
│       └── pages/                  # Main platform views
│           ├── Home.tsx            # Homepage with hero, featured properties, cities
│           ├── PropertyList.tsx    # Search results & filter sidebar
│           ├── PropertyDetail.tsx  # Full specifications, photos, and contact form
│           ├── PostProperty.tsx    # Seller listing creation wizard
│           ├── Dashboard.tsx       # User & Seller dashboard (listings, leads, saved)
│           ├── AdminDashboard.tsx  # Website Owner moderation command center
│           ├── Login.tsx           # Authentication portal
│           └── Register.tsx        # Registration portal
│
└── server/                         # Backend Application (Node.js + Express)
    ├── package.json                # Backend dependencies & build scripts
    ├── tsconfig.json               # TypeScript compiler options
    ├── .env.example                # Sample environment configuration
    └── src/
        ├── index.ts                # Express server bootstrapper & port listener
        ├── config/db.ts            # Mongoose connection handler
        ├── middleware/auth.ts      # JWT protection & dual-mode user resolution
        ├── models/                 # Mongoose schema definitions
        │   ├── User.ts             # User model (roles: buyer, owner, agent, admin)
        │   ├── Property.ts         # Property model (specs, pricing, location)
        │   └── Inquiry.ts          # Lead inquiry model
        ├── controllers/            # Request handlers
        │   ├── authController.ts   # Registration, login, profile, and wishlist
        │   ├── propertyController.ts# Property CRUD, search, and filters
        │   ├── inquiryController.ts # Lead submission and seller retrieval
        │   └── adminController.ts  # Administrative stats and moderation actions
        ├── routes/                 # Express route definitions
        │   ├── authRoutes.ts       # Auth routes
        │   ├── propertyRoutes.ts   # Property routes
        │   ├── inquiryRoutes.ts    # Inquiry routes
        │   └── adminRoutes.ts      # Admin routes
        └── utils/                  # Core utilities
            ├── memoryStore.ts      # Centralized dual-mode in-memory store
            ├── sampleData.ts       # Pre-seeded property catalog across India
            └── seedData.ts         # Standalone database seed script
```

---

## 8. Installation, Local Execution & Deployment

### 8.1 Prerequisites
* Node.js `v18.0.0` or higher
* npm `9.0.0` or higher
* Git

### 8.2 Clone & Install Dependencies
```bash
git clone https://github.com/technical-channel/real-estate-marketplace.git
cd real-estate-marketplace

# Install all workspace dependencies (root, server, and client)
npm run install-all
```

### 8.3 Environment Configuration
Create `server/.env` based on `server/.env.example`:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=ramlogics_marketplace_secret_key_2026
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/realestate?retryWrites=true&w=majority
```
*(Note: If `MONGO_URI` is left unconfigured, the platform automatically boots into the high-performance in-memory fallback mode).*

### 8.4 Running in Development Mode
```bash
# Starts both Express backend (Port 5000) and Vite frontend (Port 5173) concurrently
npm run dev
```

### 8.5 Building for Production
```bash
# Compiles both server TypeScript to /dist and client to /dist via Vite
npm run build

# Starts the compiled production backend server
npm start
```

---

## 9. Verification & Quality Assurance Summary

During comprehensive quality verification, all core user flows were validated end-to-end:
1. **Buyer Flow:** Successfully searched listings in Mumbai, filtered by 3 BHK and ₹6+ Cr budget, opened property detail page, submitted site visit inquiry, and bookmarked to saved wishlist.
2. **Seller Flow:** Authenticated as `seller@ramlogics.com`, posted a new 3 BHK penthouse in Pune for ₹1.25 Cr, confirmed publication in `/dashboard?tab=listings`, and checked incoming buyer inquiries.
3. **Admin Flow:** Authenticated as `admin@ramlogics.com`, reviewed KPI metrics, verified listings, toggled featured status, inspected the user directory, and reviewed recent platform leads.
4. **Code Quality:** 100% TypeScript compilation clean (`tsc` passed with 0 errors across both client and server), zero Vite build warnings, and clean git history.
