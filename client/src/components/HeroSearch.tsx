import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Building, IndianRupee } from 'lucide-react';
import { ListingType } from '../types';

export const HeroSearch: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ListingType>('buy');
  const [city, setCity] = useState('Mumbai');
  const [keyword, setKeyword] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const [budget, setBudget] = useState('all');
  const [selectedBHK, setSelectedBHK] = useState<string>('all');

  const tabs: { label: string; value: ListingType; description: string }[] = [
    { label: 'Buy Properties', value: 'buy', description: 'Explore 50,000+ flats, villas & builder floors' },
    { label: 'Rent Homes', value: 'rent', description: 'Zero brokerage rental apartments & homes' },
    { label: 'Commercial', value: 'commercial', description: 'Offices, shops, showrooms & tech parks' },
    { label: 'Plots / Land', value: 'plot', description: 'Residential NA plots & farm lands' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('listingType', activeTab);
    if (city && city !== 'All India') params.set('city', city);
    if (keyword.trim()) params.set('keyword', keyword.trim());
    if (propertyType !== 'all') params.set('propertyType', propertyType);
    if (selectedBHK !== 'all') params.set('bedrooms', selectedBHK);

    if (budget !== 'all') {
      const [min, max] = budget.split('-');
      if (min) params.set('minPrice', min);
      if (max) params.set('maxPrice', max);
    }

    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="relative rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden max-w-5xl mx-auto -mt-16 z-20">
      
      {/* Tab Selectors */}
      <div className="flex border-b border-gray-200 overflow-x-auto bg-gray-50/80">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex-1 py-4 px-6 text-sm sm:text-base font-extrabold whitespace-nowrap transition-all border-b-2 text-center ${
              activeTab === tab.value
                ? 'border-brand-600 text-brand-600 bg-white shadow-sm'
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Input Container */}
      <form onSubmit={handleSearch} className="p-6 sm:p-8 space-y-6">
        
        {/* Row 1: City + Search Box + Property Type */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* City Selector */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              City
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition"
              >
                <option value="All India">All India</option>
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
          </div>

          {/* Keyword / Locality Search */}
          <div className="md:col-span-5">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              Search Locality / Landmark / Project
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. Worli, Koramangala, DLF Phase 5..."
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition placeholder-gray-400"
              />
            </div>
          </div>

          {/* Property Type Dropdown */}
          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              Property Type
            </label>
            <div className="relative">
              <Building className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition"
              >
                <option value="all">All Property Types</option>
                <option value="Apartment">Apartment / Flat</option>
                <option value="Independent House / Villa">Independent Villa / House</option>
                <option value="Builder Floor">Builder Floor</option>
                <option value="Plot / Land">Plot / Land</option>
                <option value="Commercial Office">Commercial Office</option>
              </select>
            </div>
          </div>

        </div>

        {/* Row 2: BHK Selectors + Budget + Search Button */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2">
          
          {/* BHK Multi-Chips (only relevant for residential buy/rent) */}
          <div className="md:col-span-5">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              Bedrooms (BHK)
            </label>
            <div className="flex space-x-2">
              {['all', '1', '2', '3', '4'].map((bhk) => (
                <button
                  type="button"
                  key={bhk}
                  onClick={() => setSelectedBHK(bhk)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border transition ${
                    selectedBHK === bhk
                      ? 'bg-brand-600 border-brand-600 text-white shadow-sm'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {bhk === 'all' ? 'All BHK' : `${bhk} BHK`}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Range Dropdown */}
          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              Budget Range
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition"
              >
                <option value="all">Any Budget</option>
                {activeTab === 'rent' ? (
                  <>
                    <option value="0-20000">Under ₹20,000 / mo</option>
                    <option value="20000-50000">₹20K - ₹50K / mo</option>
                    <option value="50000-100000">₹50K - ₹1 Lakh / mo</option>
                    <option value="100000-">Above ₹1 Lakh / mo</option>
                  </>
                ) : (
                  <>
                    <option value="0-5000000">Under ₹50 Lakhs</option>
                    <option value="5000000-10000000">₹50 L - ₹1 Crore</option>
                    <option value="10000000-25000000">₹1 Cr - ₹2.5 Crores</option>
                    <option value="25000000-50000000">₹2.5 Cr - ₹5 Crores</option>
                    <option value="50000000-">Above ₹5 Crores</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="md:col-span-3 pt-4 sm:pt-0">
            <button
              type="submit"
              className="w-full mt-2 bg-brand-600 hover:bg-brand-700 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition transform active:scale-98"
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </button>
          </div>

        </div>

      </form>

    </div>
  );
};
