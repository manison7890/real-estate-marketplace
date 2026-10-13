import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  BedDouble, 
  Bath, 
  Maximize2, 
  Building, 
  Compass, 
  CheckCircle2, 
  ShieldCheck, 
  Heart, 
  Share2, 
  Phone, 
  Calendar, 
  ChevronRight,
  Layers,
  Sparkles
} from 'lucide-react';
import { PropertyCard } from '../components/PropertyCard';
import { InquiryModal } from '../components/InquiryModal';
import { Property } from '../types';
import { api, mockProperties } from '../services/api';
import { formatPrice, formatArea } from '../utils/format';
import { useAuth } from '../context/AuthContext';

export const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toggleWishlist, isWishlisted } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [inquiryModalOpen, setInquiryModalOpen] = useState<boolean>(false);
  const [contactSuccess, setContactSuccess] = useState<boolean>(false);

  // Quick inquiry inline form state
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('I am interested in this property. Please contact me.');

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/properties/${id}`);
        if (res.data?.property) {
          setProperty(res.data.property);
          setSimilarProperties(res.data.similar || []);
        }
      } catch (err) {
        // Fallback to mock data if API/MongoDB is offline
        const found = mockProperties.find((p) => p._id === id) || mockProperties[0];
        setProperty(found);
        setSimilarProperties(mockProperties.filter((p) => p._id !== found._id).slice(0, 3));
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const saved = isWishlisted(property._id);
  const photos = property.photos && property.photos.length > 0 ? property.photos : [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  ];

  const handleInlineInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/inquiries', {
        propertyId: property._id,
        name: contactName,
        phone: contactPhone,
        email: contactEmail,
        message: contactMsg,
      });
      setContactSuccess(true);
    } catch {
      setContactSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-gray-500 mb-6 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-brand-600">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link to={`/properties?city=${property.location.city}`} className="hover:text-brand-600">
            {property.location.city}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link to={`/properties?listingType=${property.listingType}`} className="hover:text-brand-600">
            {property.listingType.toUpperCase()}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 font-bold truncate max-w-xs">{property.title}</span>
        </div>

        {/* Top Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-brand-600 text-white text-xs font-black px-3 py-1 rounded-md uppercase tracking-wider">
                For {property.listingType}
              </span>
              <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-md">
                {property.propertyType}
              </span>
              {property.verified && (
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-md flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Listing</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-snug">
              {property.title}
            </h1>

            <div className="flex items-center text-sm text-gray-500 mt-2 space-x-1.5">
              <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
              <span>{property.location.address}, {property.location.locality}, {property.location.city} - {property.location.pinCode}</span>
            </div>
          </div>

          <div className="flex flex-col md:items-end shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
            <span className="text-3xl sm:text-4xl font-black text-brand-700 tracking-tight">
              {formatPrice(property.price, property.listingType)}
            </span>
            {property.features.carpetAreaSqFt > 0 && property.listingType !== 'rent' && (
              <span className="text-xs text-gray-500 font-medium mt-1">
                ₹{Math.round(property.price / property.features.carpetAreaSqFt).toLocaleString('en-IN')} / sq.ft
              </span>
            )}

            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => toggleWishlist(property._id)}
                className={`p-2.5 rounded-xl border transition flex items-center space-x-1.5 text-xs font-bold ${
                  saved
                    ? 'bg-red-50 border-red-200 text-red-600'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                <span>{saved ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Property link copied to clipboard!');
                }}
                className="p-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition flex items-center space-x-1.5 text-xs font-bold"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Gallery & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content Area (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Gallery Viewer */}
            <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100">
                <img
                  src={photos[activePhotoIndex]}
                  alt={`Photo ${activePhotoIndex + 1}`}
                  className="w-full h-full object-cover transition duration-300"
                />
              </div>

              {/* Thumbnails */}
              {photos.length > 1 && (
                <div className="flex space-x-3 mt-4 overflow-x-auto pb-2">
                  {photos.map((photo, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                        activePhotoIndex === idx ? 'border-brand-600 ring-2 ring-brand-500/20' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={photo} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Key Specifications Grid */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center space-x-2">
                <Building className="w-5 h-5 text-brand-600" />
                <span>Overview &amp; Key Specifications</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center space-x-2 text-gray-400 mb-1">
                    <BedDouble className="w-4 h-4 text-brand-600" />
                    <span className="text-xs uppercase font-semibold">Bedrooms</span>
                  </div>
                  <p className="text-base font-bold text-gray-900">
                    {property.features.bedrooms > 0 ? `${property.features.bedrooms} BHK` : 'N/A'}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center space-x-2 text-gray-400 mb-1">
                    <Bath className="w-4 h-4 text-brand-600" />
                    <span className="text-xs uppercase font-semibold">Bathrooms</span>
                  </div>
                  <p className="text-base font-bold text-gray-900">
                    {property.features.bathrooms} Baths
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center space-x-2 text-gray-400 mb-1">
                    <Maximize2 className="w-4 h-4 text-brand-600" />
                    <span className="text-xs uppercase font-semibold">Carpet Area</span>
                  </div>
                  <p className="text-base font-bold text-gray-900">
                    {formatArea(property.features.carpetAreaSqFt)}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center space-x-2 text-gray-400 mb-1">
                    <Building className="w-4 h-4 text-brand-600" />
                    <span className="text-xs uppercase font-semibold">Furnishing</span>
                  </div>
                  <p className="text-base font-bold text-gray-900">
                    {property.features.furnishing}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center space-x-2 text-gray-400 mb-1">
                    <Compass className="w-4 h-4 text-brand-600" />
                    <span className="text-xs uppercase font-semibold">Facing</span>
                  </div>
                  <p className="text-base font-bold text-gray-900">
                    {property.features.facing || 'East'}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center space-x-2 text-gray-400 mb-1">
                    <Layers className="w-4 h-4 text-brand-600" />
                    <span className="text-xs uppercase font-semibold">Floor No</span>
                  </div>
                  <p className="text-base font-bold text-gray-900">
                    {property.features.floorNo ? `${property.features.floorNo} of ${property.features.totalFloors || 'N/A'}` : 'Ground'}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center space-x-2 text-gray-400 mb-1">
                    <Sparkles className="w-4 h-4 text-brand-600" />
                    <span className="text-xs uppercase font-semibold">Possession</span>
                  </div>
                  <p className="text-base font-bold text-gray-900">
                    {property.features.possessionStatus || 'Ready to Move'}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center space-x-2 text-gray-400 mb-1">
                    <Calendar className="w-4 h-4 text-brand-600" />
                    <span className="text-xs uppercase font-semibold">Maintenance</span>
                  </div>
                  <p className="text-base font-bold text-gray-900">
                    {property.maintenanceCharges ? `₹${property.maintenanceCharges.toLocaleString('en-IN')}/mo` : 'Included'}
                  </p>
                </div>

              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-black text-gray-900 mb-4">About this Property</h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-black text-gray-900 mb-6">Society &amp; Building Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm font-semibold text-gray-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar: Contact Seller Lead Box (4 Cols) */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-xl">
              
              <div className="flex items-center space-x-3 pb-5 border-b border-gray-100">
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-extrabold flex items-center justify-center text-lg shadow-md shadow-brand-500/20">
                  {property.contactName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-base font-black text-gray-900">{property.contactName}</h4>
                  <p className="text-xs text-brand-600 font-bold">Property Owner / Certified Agent</p>
                </div>
              </div>

              {/* Direct Call Button */}
              <div className="mt-5">
                <a
                  href={`tel:${property.contactPhone}`}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {property.contactPhone}</span>
                </a>
              </div>

              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                <span className="relative bg-white px-3 text-xs uppercase font-bold text-gray-400">or send message</span>
              </div>

              {/* Inline Inquiry Form */}
              {contactSuccess ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-xs font-bold">Inquiry sent to seller!</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">They will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleInlineInquiry} className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number (+91)"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                  <textarea
                    rows={2}
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold rounded-xl shadow-md transition text-xs"
                  >
                    Request Callback &amp; Details
                  </button>
                </form>
              )}

              {/* Schedule Site Visit CTA */}
              <button
                onClick={() => setInquiryModalOpen(true)}
                className="w-full mt-3 py-3 bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold rounded-xl border border-gray-200 text-xs flex items-center justify-center space-x-2 transition"
              >
                <Calendar className="w-4 h-4 text-brand-600" />
                <span>Schedule In-Person Site Visit</span>
              </button>

            </div>

          </div>

        </div>

        {/* Similar Properties Section */}
        {similarProperties.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <h3 className="text-xl font-black text-gray-900 mb-6">
              Similar Properties in {property.location.city}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((prop) => (
                <PropertyCard key={prop._id} property={prop} />
              ))}
            </div>
          </div>
        )}

      </div>

      <InquiryModal
        property={property}
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
      />
    </div>
  );
};
