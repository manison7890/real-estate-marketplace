import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Home as HomeIcon, 
  Briefcase, 
  Map, 
  Sparkles, 
  ArrowRight, 
  PhoneCall, 
  BadgePercent,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import { HeroSearch } from '../components/HeroSearch';
import { PropertyCard } from '../components/PropertyCard';
import { InquiryModal } from '../components/InquiryModal';
import { Property } from '../types';
import { api, mockProperties } from '../services/api';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>(mockProperties);
  const [selectedPropertyForContact, setSelectedPropertyForContact] = useState<Property | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/properties/featured');
        if (res.data?.properties && res.data.properties.length > 0) {
          setFeaturedProperties(res.data.properties);
        }
      } catch (err) {
        console.log('Using local mock data for featured listings preview');
      }
    };
    fetchFeatured();
  }, []);

  const majorCities = [
    { name: 'Mumbai', count: '14,250+ Properties', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80' },
    { name: 'Bangalore', count: '18,400+ Properties', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80' },
    { name: 'Delhi NCR', count: '12,900+ Properties', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80' },
    { name: 'Pune', count: '9,800+ Properties', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80' },
    { name: 'Hyderabad', count: '8,650+ Properties', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80' },
    { name: 'Gurgaon', count: '7,300+ Properties', img: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-950 via-brand-950 to-slate-900 text-white pt-20 pb-32 overflow-hidden">
        
        {/* Background glow & subtle patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(132,189,47,0.22),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/15 text-xs font-bold text-brand-300 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>India's Most Trusted Real Estate Marketplace</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight">
            Find Your Dream Space in <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#d9f99d] via-[#a3e635] to-[#84bd2f]">
              India's Top Cities
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-medium">
            Browse verified flats, villas, residential plots & commercial spaces with direct owner contact and zero brokerage options.
          </p>

          {/* Key Metrics Strip */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-8 text-sm font-semibold text-slate-300">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-brand-400" />
              <span>100% Verified Properties</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-brand-400" />
              <span>Zero Brokerage Options</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-brand-400" />
              <span>Direct Owner & Builder Deals</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Embedded Floating Hero Search */}
      <section className="px-4 sm:px-6 lg:px-8">
        <HeroSearch />
      </section>

      {/* 3. Category Quick Navigation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Explore by Property Category
          </h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Quickly navigate to what fits your lifestyle and investment goal
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          
          <Link
            to="/properties?listingType=buy&propertyType=Apartment"
            className="group p-5 bg-white rounded-2xl border border-gray-200 hover:border-brand-500 shadow-sm hover:shadow-xl transition flex flex-col items-center text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all">
              <Building2 className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Residential Flats</h3>
            <span className="text-xs text-gray-400 mt-0.5">1, 2, 3, 4 BHKs</span>
          </Link>

          <Link
            to="/properties?listingType=buy&propertyType=Independent+House+/+Villa"
            className="group p-5 bg-white rounded-2xl border border-gray-200 hover:border-brand-500 shadow-sm hover:shadow-xl transition flex flex-col items-center text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all">
              <HomeIcon className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Villas & Houses</h3>
            <span className="text-xs text-gray-400 mt-0.5">Independent Living</span>
          </Link>

          <Link
            to="/properties?listingType=rent"
            className="group p-5 bg-white rounded-2xl border border-gray-200 hover:border-brand-500 shadow-sm hover:shadow-xl transition flex flex-col items-center text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <BadgePercent className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Rent a Home</h3>
            <span className="text-xs text-gray-400 mt-0.5">Furnished & Ready</span>
          </Link>

          <Link
            to="/properties?listingType=commercial"
            className="group p-5 bg-white rounded-2xl border border-gray-200 hover:border-brand-500 shadow-sm hover:shadow-xl transition flex flex-col items-center text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all">
              <Briefcase className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Commercial</h3>
            <span className="text-xs text-gray-400 mt-0.5">Offices & Retail</span>
          </Link>

          <Link
            to="/properties?listingType=plot"
            className="group p-5 bg-white rounded-2xl border border-gray-200 hover:border-brand-500 shadow-sm hover:shadow-xl transition flex flex-col items-center text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all">
              <Map className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Plots & Land</h3>
            <span className="text-xs text-gray-400 mt-0.5">Gated Townships</span>
          </Link>

        </div>
      </section>

      {/* 4. Featured Listings Grid */}
      <section className="bg-white py-16 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-brand-600 text-xs font-bold uppercase tracking-wider mb-1">
                <TrendingUp className="w-4 h-4" />
                <span>Handpicked Collections</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Featured Properties
              </h2>
            </div>
            
            <Link
              to="/properties"
              className="mt-4 sm:mt-0 inline-flex items-center space-x-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 transition"
            >
              <span>View All Properties</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.slice(0, 6).map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                onContactClick={(prop) => setSelectedPropertyForContact(prop)}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 5. Explore by Major Cities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Explore Real Estate in Top Indian Cities
          </h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Discover verified listings in India's fastest-growing metropolitan markets
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {majorCities.map((c) => (
            <button
              key={c.name}
              onClick={() => navigate(`/properties?city=${encodeURIComponent(c.name)}`)}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-sm hover:shadow-xl transition-all"
            >
              <img
                src={c.img}
                alt={c.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-left">
                <h4 className="text-base font-extrabold text-white">{c.name}</h4>
                <p className="text-[11px] text-gray-300 font-medium">{c.count}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 6. Post Property Banner (Lead Gen like 99acres) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-brand-700 via-brand-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-xl z-10">
            <span className="bg-amber-400 text-slate-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
              For Property Owners & Agents
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Post Your Property for FREE &amp; Reach Millions of Genuine Buyers
            </h2>
            <p className="text-sm text-brand-100 mt-3 font-medium">
              Get genuine buyer leads, free zero-brokerage listing, and dedicated relationship manager support.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <Link
                to="/post-property"
                className="bg-white hover:bg-gray-100 text-brand-900 font-extrabold px-6 py-3.5 rounded-xl shadow-lg transition"
              >
                Post Property Free
              </Link>
              <Link
                to="/properties?listingType=rent"
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-xl border border-white/20 transition"
              >
                Browse Rentals
              </Link>
            </div>
          </div>

          <div className="mt-8 md:mt-0 z-10 flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center min-w-[240px]">
            <PhoneCall className="w-10 h-10 text-amber-400 mb-2" />
            <span className="text-xs uppercase font-bold text-brand-200">Need Listing Assistance?</span>
            <span className="text-lg font-black text-white mt-1">1800-120-7265</span>
            <span className="text-[10px] text-brand-200">Toll Free • Mon-Sat 9 AM - 8 PM</span>
          </div>
        </div>
      </section>

      {/* Inquiry Lead Modal */}
      <InquiryModal
        property={selectedPropertyForContact}
        isOpen={Boolean(selectedPropertyForContact)}
        onClose={() => setSelectedPropertyForContact(null)}
      />

    </div>
  );
};
