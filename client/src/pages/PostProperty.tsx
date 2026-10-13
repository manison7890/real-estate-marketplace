import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  IndianRupee, 
  Image as ImageIcon, 
  CheckCircle2, 
  Layers, 
  ShieldCheck,
  Plus,
  Trash2
} from 'lucide-react';
import { api, mockProperties } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ListingType } from '../types';

export const PostProperty: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listingType, setListingType] = useState<ListingType>('buy');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Location
  const [city, setCity] = useState('Mumbai');
  const [locality, setLocality] = useState('');
  const [address, setAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [state, setState] = useState('Maharashtra');

  // Specs
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [balconies, setBalconies] = useState(1);
  const [carpetArea, setCarpetArea] = useState<number>(1050);
  const [superArea, setSuperArea] = useState<number>(1300);
  const [furnishing, setFurnishing] = useState<'Furnished' | 'Semi-Furnished' | 'Unfurnished'>('Semi-Furnished');
  const [floorNo, setFloorNo] = useState(4);
  const [totalFloors, setTotalFloors] = useState(12);
  const [facing, setFacing] = useState('East');
  const [possessionStatus, setPossessionStatus] = useState<'Ready to Move' | 'Under Construction'>('Ready to Move');

  // Amenities
  const availableAmenities = [
    'Lift', 'Swimming Pool', 'Gymnasium', 'Covered Parking', 'Club House',
    'Power Backup', 'Security / Fire Alarm', 'Intercom', 'Park / Garden',
    'Water Storage', 'Cafeteria', 'Central AC'
  ];
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Lift', 'Covered Parking', 'Power Backup', 'Security / Fire Alarm'
  ]);

  // Pricing
  const [price, setPrice] = useState<number>(8500000);
  const [priceNegotiable, setPriceNegotiable] = useState(true);
  const [maintenanceCharges, setMaintenanceCharges] = useState<number>(3000);

  // Photos
  const [photoUrls, setPhotoUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
  ]);
  const [newPhotoInput, setNewPhotoInput] = useState('');

  // Contact
  const [contactName, setContactName] = useState(user?.name || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');

  useEffect(() => {
    if (user) {
      if (!contactName && user.name) setContactName(user.name);
      if (!contactPhone && user.phone) setContactPhone(user.phone);
      if (!contactEmail && user.email) setContactEmail(user.email);
    }
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleAmenity = (name: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const addPhoto = () => {
    if (newPhotoInput.trim()) {
      setPhotoUrls([...photoUrls, newPhotoInput.trim()]);
      setNewPhotoInput('');
    }
  };

  const removePhoto = (index: number) => {
    setPhotoUrls(photoUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const payload = {
      title,
      description,
      listingType,
      propertyType,
      price: Number(price),
      priceNegotiable,
      maintenanceCharges: Number(maintenanceCharges),
      location: {
        address,
        locality,
        city,
        state,
        pinCode,
      },
      features: {
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        balconies: Number(balconies),
        carpetAreaSqFt: Number(carpetArea),
        superAreaSqFt: Number(superArea),
        furnishing,
        floorNo: Number(floorNo),
        totalFloors: Number(totalFloors),
        facing,
        possessionStatus,
      },
      amenities: selectedAmenities,
      photos: photoUrls,
      contactName,
      contactPhone,
      contactEmail,
    };

    try {
      const res = await api.post('/properties', payload);
      if (res.data?.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/property/${res.data.property._id}`);
        }, 1500);
      }
    } catch (err: any) {
      console.warn('API submission failed, storing in staging session:', err);
      // Fallback for offline demo
      const mockNewProp: any = {
        _id: 'new-' + Date.now(),
        ...payload,
        owner: { name: contactName, phone: contactPhone, email: contactEmail },
        featured: false,
        verified: true,
        viewsCount: 1,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      mockProperties.unshift(mockNewProp);
      setSuccess(true);
      setTimeout(() => {
        navigate(`/property/${mockNewProp._id}`);
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero Brokerage • 100% Free Listing</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Post Your Property on Ramlogics Realty
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill in your property details to start receiving inquiries from verified buyers and tenants.
          </p>
        </div>

        {success ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-xl">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-black text-gray-900">Property Published Successfully!</h2>
            <p className="text-sm text-gray-500 mt-2">
              Your listing is live on the marketplace. Redirecting to your property page...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {errorMsg && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold">
                {errorMsg}
              </div>
            )}

            {/* 1. Basic Details */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="text-base font-black text-gray-900 uppercase tracking-wider flex items-center space-x-2 border-b border-gray-100 pb-4">
                <Building2 className="w-5 h-5 text-brand-600" />
                <span>1. Basic Property Details</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">I Want to *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Sell / Resale', val: 'buy' },
                    { label: 'Rent Out', val: 'rent' },
                    { label: 'Commercial', val: 'commercial' },
                    { label: 'Plot / Land', val: 'plot' },
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setListingType(item.val as ListingType)}
                      className={`py-3 px-4 rounded-xl border text-sm font-bold transition text-center ${
                        listingType === item.val
                          ? 'bg-brand-600 border-brand-600 text-white shadow-md'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Property Type *</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Apartment">Apartment / High-rise Flat</option>
                    <option value="Independent House / Villa">Independent House / Villa</option>
                    <option value="Builder Floor">Builder Floor</option>
                    <option value="Plot / Land">Residential Plot / Land</option>
                    <option value="Commercial Office">Commercial Office Space</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Property Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Spacious 3 BHK Sea View Apartment in Worli"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your property, furnishings, view, nearby landmarks, schools, and transit..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* 2. Location */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="text-base font-black text-gray-900 uppercase tracking-wider flex items-center space-x-2 border-b border-gray-100 pb-4">
                <MapPin className="w-5 h-5 text-brand-600" />
                <span>2. Property Location</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">City *</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Mumbai">Mumbai</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Gurgaon">Gurgaon</option>
                    <option value="Noida">Noida</option>
                    <option value="Pune">Pune</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Chennai">Chennai</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Locality / Sector *</label>
                  <input
                    type="text"
                    required
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Worli, Koramangala, Sector 54"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="e.g. 400018"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Maharashtra"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Complete Address *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Flat 32, Lodha Bellissimo, NM Joshi Marg"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* 3. Specifications */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="text-base font-black text-gray-900 uppercase tracking-wider flex items-center space-x-2 border-b border-gray-100 pb-4">
                <Layers className="w-5 h-5 text-brand-600" />
                <span>3. Specifications &amp; Area</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Bedrooms (BHK)</label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                  >
                    {[0, 1, 2, 3, 4, 5].map((b) => (
                      <option key={b} value={b}>{b === 0 ? 'None (Commercial/Plot)' : `${b} BHK`}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Bathrooms</label>
                  <input
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Balconies</label>
                  <input
                    type="number"
                    value={balconies}
                    onChange={(e) => setBalconies(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Carpet Area (sq.ft) *</label>
                  <input
                    type="number"
                    required
                    value={carpetArea}
                    onChange={(e) => setCarpetArea(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Super Area (sq.ft)</label>
                  <input
                    type="number"
                    value={superArea}
                    onChange={(e) => setSuperArea(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Floor No</label>
                  <input
                    type="number"
                    value={floorNo}
                    onChange={(e) => setFloorNo(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Total Floors</label>
                  <input
                    type="number"
                    value={totalFloors}
                    onChange={(e) => setTotalFloors(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Facing</label>
                  <select
                    value={facing}
                    onChange={(e) => setFacing(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                  >
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="North-East">North-East</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Possession Status</label>
                  <select
                    value={possessionStatus}
                    onChange={(e) => setPossessionStatus(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                  >
                    <option value="Ready to Move">Ready to Move</option>
                    <option value="Under Construction">Under Construction</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Furnishing</label>
                  <select
                    value={furnishing}
                    onChange={(e) => setFurnishing(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold"
                  >
                    <option value="Furnished">Furnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 4. Amenities Checklist */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="text-base font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-4">
                4. Amenities &amp; Facilities
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {availableAmenities.map((amenity) => {
                  const isChecked = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition flex items-center justify-between ${
                        isChecked
                          ? 'bg-brand-50 border-brand-600 text-brand-700'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span>{amenity}</span>
                      {isChecked && <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Pricing */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="text-base font-black text-gray-900 uppercase tracking-wider flex items-center space-x-2 border-b border-gray-100 pb-4">
                <IndianRupee className="w-5 h-5 text-brand-600" />
                <span>5. Pricing &amp; Terms</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                    Expected Price (in ₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="e.g. 8500000"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base font-black text-brand-700 outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                    Monthly Maintenance (₹)
                  </label>
                  <input
                    type="number"
                    value={maintenanceCharges}
                    onChange={(e) => setMaintenanceCharges(Number(e.target.value))}
                    placeholder="e.g. 3500"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center space-x-2 text-sm font-bold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={priceNegotiable}
                      onChange={(e) => setPriceNegotiable(e.target.checked)}
                      className="w-4 h-4 text-brand-600 rounded border-gray-300 focus:ring-brand-500"
                    />
                    <span>Price is Negotiable</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 6. Photos */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="text-base font-black text-gray-900 uppercase tracking-wider flex items-center space-x-2 border-b border-gray-100 pb-4">
                <ImageIcon className="w-5 h-5 text-brand-600" />
                <span>6. Property Photos</span>
              </h3>

              <div className="flex space-x-2">
                <input
                  type="url"
                  value={newPhotoInput}
                  onChange={(e) => setNewPhotoInput(e.target.value)}
                  placeholder="Paste high-res image URL (e.g. from Unsplash or Cloudinary)..."
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="button"
                  onClick={addPhoto}
                  className="px-5 py-2.5 bg-gray-900 text-white font-bold rounded-xl text-xs flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add URL</span>
                </button>
              </div>

              {/* Photo Previews */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {photoUrls.map((url, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 group">
                    <img src={url} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-md opacity-80 hover:opacity-100 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. Contact Details */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="text-base font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-4">
                7. Owner / Agent Contact Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="ramesh@gmail.com"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-2 transition transform active:scale-98 disabled:opacity-50"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{loading ? 'Publishing Property...' : 'Submit & Publish Listing Free'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
