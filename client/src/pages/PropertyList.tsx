import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  RotateCcw, 
  Search, 
  SlidersHorizontal,
  Building2
} from 'lucide-react';
import { PropertyCard } from '../components/PropertyCard';
import { InquiryModal } from '../components/InquiryModal';
import { Property, ListingType } from '../types';
import { api, mockProperties } from '../services/api';

export const PropertyList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedPropertyForContact, setSelectedPropertyForContact] = useState<Property | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters State derived from URL query parameters
  const listingType = (searchParams.get('listingType') as ListingType | 'all') || 'all';
  const city = searchParams.get('city') || '';
  const keyword = searchParams.get('keyword') || '';
  const propertyType = searchParams.get('propertyType') || 'all';
  const bedrooms = searchParams.get('bedrooms') || 'all';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const furnishing = searchParams.get('furnishing') || 'all';
  const possessionStatus = searchParams.get('possessionStatus') || 'all';
  const sort = searchParams.get('sort') || 'newest';

  // Helper to update query params
  const updateFilter = (key: string, value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (!value || value === 'all') {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }
    setSearchParams(nextParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  useEffect(() => {
    const fetchFilteredProperties = async () => {
      setLoading(true);
      try {
        const queryParams = searchParams.toString();
        const res = await api.get(`/properties?${queryParams}`);
        if (res.data?.properties) {
          setProperties(res.data.properties);
          setTotalCount(res.data.total || res.data.properties.length);
        }
      } catch (err) {
        console.warn('API unavailable, applying client-side filtering on mock dataset:', err);
        
        // Client-side filtering logic on mock dataset for immediate preview
        let filtered = [...mockProperties];

        if (listingType && listingType !== 'all') {
          filtered = filtered.filter((p) => p.listingType === listingType);
        }
        if (city && city !== 'All India') {
          filtered = filtered.filter((p) => p.location.city.toLowerCase().includes(city.toLowerCase()));
        }
        if (propertyType && propertyType !== 'all') {
          filtered = filtered.filter((p) => p.propertyType === propertyType);
        }
        if (bedrooms && bedrooms !== 'all') {
          const reqBhk = Number(bedrooms);
          filtered = filtered.filter((p) => p.features.bedrooms === reqBhk);
        }
        if (minPrice) {
          filtered = filtered.filter((p) => p.price >= Number(minPrice));
        }
        if (maxPrice) {
          filtered = filtered.filter((p) => p.price <= Number(maxPrice));
        }
        if (furnishing && furnishing !== 'all') {
          filtered = filtered.filter((p) => p.features.furnishing === furnishing);
        }
        if (possessionStatus && possessionStatus !== 'all') {
          filtered = filtered.filter((p) => p.features.possessionStatus === possessionStatus);
        }
        if (keyword) {
          const lower = keyword.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.title.toLowerCase().includes(lower) ||
              p.location.locality.toLowerCase().includes(lower) ||
              p.location.city.toLowerCase().includes(lower)
          );
        }

        // Sorting
        if (sort === 'price_asc') {
          filtered.sort((a, b) => a.price - b.price);
        } else if (sort === 'price_desc') {
          filtered.sort((a, b) => b.price - a.price);
        } else if (sort === 'popularity') {
          filtered.sort((a, b) => b.viewsCount - a.viewsCount);
        }

        setProperties(filtered);
        setTotalCount(filtered.length);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProperties();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Controls Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-xl font-bold text-xs"
            >
              <Filter className="w-4 h-4 text-brand-600" />
              <span>Filters</span>
            </button>

            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight">
                {city ? `Properties in ${city}` : 'All Verified Properties across India'}
              </h1>
              <p className="text-xs text-gray-500">
                Found <span className="font-bold text-brand-600">{totalCount}</span> available listings
              </p>
            </div>
          </div>

          {/* Search keyword input & Sort */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => updateFilter('keyword', e.target.value)}
                placeholder="Filter by locality..."
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div className="flex items-center space-x-1.5 shrink-0">
              <span className="text-xs font-bold text-gray-500 hidden sm:inline">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="popularity">Most Popular</option>
              </select>
            </div>
          </div>

        </div>

        {/* Main Layout: Filter Sidebar + Listings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Filter Sidebar (Desktop) */}
          <aside className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'} bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 sticky top-24`}>
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Refine Search</h3>
              </div>
              <button
                onClick={clearAllFilters}
                className="text-xs text-brand-600 hover:text-brand-800 font-bold flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* 1. Listing Type */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">I Want to</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Buy', val: 'buy' },
                  { label: 'Rent', val: 'rent' },
                  { label: 'Commercial', val: 'commercial' },
                  { label: 'Plot / Land', val: 'plot' },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => updateFilter('listingType', item.val)}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition ${
                      listingType === item.val
                        ? 'bg-brand-600 border-brand-600 text-white shadow-sm'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. City Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">City</label>
              <select
                value={city}
                onChange={(e) => updateFilter('city', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">All India</option>
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

            {/* 3. BHK Bedrooms Selection */}
            {listingType !== 'plot' && (
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Bedrooms (BHK)</label>
                <div className="flex space-x-1.5">
                  {['all', '1', '2', '3', '4'].map((bhk) => (
                    <button
                      key={bhk}
                      type="button"
                      onClick={() => updateFilter('bedrooms', bhk)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition ${
                        bedrooms === bhk
                          ? 'bg-brand-600 border-brand-600 text-white'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {bhk === 'all' ? 'All' : `${bhk} BHK`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Property Type */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => updateFilter('propertyType', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="all">All Types</option>
                <option value="Apartment">Apartment / Flat</option>
                <option value="Independent House / Villa">Independent Villa / House</option>
                <option value="Builder Floor">Builder Floor</option>
                <option value="Plot / Land">Plot / Land</option>
                <option value="Commercial Office">Commercial Office</option>
              </select>
            </div>

            {/* 5. Furnishing */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Furnishing</label>
              <div className="grid grid-cols-3 gap-1.5">
                {['all', 'Furnished', 'Semi-Furnished', 'Unfurnished'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => updateFilter('furnishing', f)}
                    className={`py-1.5 px-1 text-[11px] font-bold rounded-lg border text-center transition ${
                      furnishing === f
                        ? 'bg-brand-600 border-brand-600 text-white'
                        : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    {f === 'all' ? 'Any' : f}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Possession Status */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Possession Status</label>
              <div className="flex space-x-2">
                {[
                  { label: 'Any', val: 'all' },
                  { label: 'Ready to Move', val: 'Ready to Move' },
                  { label: 'Under Const.', val: 'Under Construction' },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => updateFilter('possessionStatus', item.val)}
                    className={`flex-1 py-1.5 px-1 text-[11px] font-bold rounded-lg border text-center transition ${
                      possessionStatus === item.val
                        ? 'bg-brand-600 border-brand-600 text-white'
                        : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* Listings Grid (3 Columns on Large Screens) */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-2xl h-80 border border-gray-200"></div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Building2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-gray-900">No properties matched your criteria</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Try broadening your budget range, removing BHK constraints, or exploring nearby cities.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-6 px-6 py-2.5 bg-brand-600 text-white font-bold text-xs rounded-xl hover:bg-brand-700 transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((prop) => (
                  <PropertyCard
                    key={prop._id}
                    property={prop}
                    onContactClick={(p) => setSelectedPropertyForContact(p)}
                  />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Inquiry Lead Modal */}
      <InquiryModal
        property={selectedPropertyForContact}
        isOpen={Boolean(selectedPropertyForContact)}
        onClose={() => setSelectedPropertyForContact(null)}
      />
    </div>
  );
};
