import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Building, 
  MessageSquare, 
  Heart, 
  Eye, 
  Trash2, 
  PlusCircle, 
  Phone, 
  Mail, 
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Property, Inquiry } from '../types';
import { api, mockProperties } from '../services/api';
import { PropertyCard } from '../components/PropertyCard';
import { formatPrice } from '../utils/format';

export const Dashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  
  const currentTab = searchParams.get('tab') || 'listings';

  const [myListings, setMyListings] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [wishlistProperties, setWishlistProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch User Listings
        const resListings = await api.get('/properties/my-listings');
        if (resListings.data?.properties) {
          setMyListings(resListings.data.properties);
        }
      } catch {
        // Fallback demo listings
        setMyListings(mockProperties.slice(0, 2));
      }

      try {
        // Fetch Inquiries
        const resInq = await api.get('/inquiries/my-inquiries');
        if (resInq.data?.received) {
          setInquiries(resInq.data.received);
        }
      } catch {
        // Demo inquiries
        setInquiries([
          {
            _id: 'inq-1',
            property: mockProperties[0],
            name: 'Amit Patel',
            phone: '+91 98211 44556',
            email: 'amit.patel@gmail.com',
            message: 'Looking to schedule a weekend site visit with family.',
            status: 'new',
            createdAt: new Date().toISOString(),
          },
        ]);
      }

      // Fetch Saved wishlist items
      const savedIds = user?.savedProperties || JSON.parse(localStorage.getItem('guest_wishlist') || '[]');
      const saved = mockProperties.filter((p) => savedIds.includes(p._id));
      setWishlistProperties(saved);

      setLoading(false);
    };

    fetchDashboardData();
  }, [user]);

  const handleDeleteListing = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this property listing?')) return;
    try {
      await api.delete(`/properties/${id}`);
      setMyListings(myListings.filter((p) => p._id !== id));
    } catch {
      setMyListings(myListings.filter((p) => p._id !== id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-brand-500/20">
              {(user?.name || 'User').charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Welcome, {user?.name || 'Property Owner'}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Manage your listed properties, buyer inquiries, and saved favorites.
              </p>
            </div>
          </div>

          <Link
            to="/post-property"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Property</span>
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8 space-x-2">
          <button
            onClick={() => setSearchParams({ tab: 'listings' })}
            className={`flex items-center space-x-2 py-3.5 px-6 font-bold text-sm border-b-2 transition ${
              currentTab === 'listings'
                ? 'border-brand-600 text-brand-600 bg-white rounded-t-2xl shadow-sm'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>My Properties ({myListings.length})</span>
          </button>

          <button
            onClick={() => setSearchParams({ tab: 'inquiries' })}
            className={`flex items-center space-x-2 py-3.5 px-6 font-bold text-sm border-b-2 transition ${
              currentTab === 'inquiries'
                ? 'border-brand-600 text-brand-600 bg-white rounded-t-2xl shadow-sm'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Buyer Inquiries ({inquiries.length})</span>
          </button>

          <button
            onClick={() => setSearchParams({ tab: 'wishlist' })}
            className={`flex items-center space-x-2 py-3.5 px-6 font-bold text-sm border-b-2 transition ${
              currentTab === 'wishlist'
                ? 'border-brand-600 text-brand-600 bg-white rounded-t-2xl shadow-sm'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Wishlist ({wishlistProperties.length})</span>
          </button>
        </div>

        {/* Tab 1: My Listings */}
        {currentTab === 'listings' && (
          <div>
            {myListings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
                <Building className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-800">You haven't posted any properties yet</h3>
                <p className="text-xs text-gray-500 mt-1">List your flat, villa, or commercial space in 2 minutes.</p>
                <Link
                  to="/post-property"
                  className="mt-4 inline-block px-5 py-2.5 bg-brand-600 text-white font-bold text-xs rounded-xl"
                >
                  Post Property Free
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myListings.map((prop) => (
                  <div
                    key={prop._id}
                    className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
                  >
                    <div className="flex items-center space-x-4 w-full sm:w-auto">
                      <img
                        src={prop.photos[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80'}
                        alt={prop.title}
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                      />
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider bg-brand-50 text-brand-700 px-2 py-0.5 rounded">
                          {prop.listingType} • {prop.propertyType}
                        </span>
                        <h4 className="text-sm font-bold text-gray-900 mt-1">{prop.title}</h4>
                        <p className="text-xs text-gray-500">{prop.location.locality}, {prop.location.city}</p>
                        <p className="text-sm font-black text-brand-700 mt-1">
                          {formatPrice(prop.price, prop.listingType)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                      <div className="flex items-center space-x-1 text-xs text-gray-400 mr-2">
                        <Eye className="w-4 h-4" />
                        <span>{prop.viewsCount} views</span>
                      </div>
                      <Link
                        to={`/property/${prop._id}`}
                        className="p-2 text-gray-600 hover:text-brand-600 bg-gray-50 rounded-lg transition"
                        title="View Live Listing"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteListing(prop._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Inquiries Received */}
        {currentTab === 'inquiries' && (
          <div>
            {inquiries.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-800">No buyer inquiries received yet</h3>
                <p className="text-xs text-gray-500 mt-1">When buyers contact you, their leads will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div
                    key={inq._id}
                    className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div>
                        <span className="text-xs font-bold text-gray-400">Inquiry on Property:</span>
                        <h4 className="text-sm font-bold text-brand-700">{inq.property?.title || 'Property'}</h4>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(inq.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>

                    <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-xl italic">
                      "{inq.message}"
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                      <div className="flex items-center space-x-4 text-xs font-semibold text-gray-600">
                        <span className="font-bold text-gray-900">{inq.name}</span>
                        <a href={`tel:${inq.phone}`} className="flex items-center space-x-1 text-emerald-600 hover:underline">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{inq.phone}</span>
                        </a>
                        <a href={`mailto:${inq.email}`} className="flex items-center space-x-1 text-brand-600 hover:underline">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{inq.email}</span>
                        </a>
                      </div>

                      <a
                        href={`tel:${inq.phone}`}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition"
                      >
                        Call Buyer Now
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Saved Wishlist */}
        {currentTab === 'wishlist' && (
          <div>
            {wishlistProperties.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-800">Your wishlist is empty</h3>
                <p className="text-xs text-gray-500 mt-1">Browse properties and click the heart icon to save them.</p>
                <Link
                  to="/properties"
                  className="mt-4 inline-block px-5 py-2.5 bg-brand-600 text-white font-bold text-xs rounded-xl"
                >
                  Explore Properties
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistProperties.map((p) => (
                  <PropertyCard key={p._id} property={p} />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
