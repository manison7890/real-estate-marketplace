import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, User as UserIcon, PlusCircle, MapPin, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  selectedCity?: string;
  onCityChange?: (city: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ selectedCity = 'Mumbai', onCityChange }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const cities = ['All India', 'Mumbai', 'Delhi NCR', 'Bangalore', 'Pune', 'Hyderabad', 'Gurgaon', 'Noida', 'Chennai'];

  const handleCitySelect = (city: string) => {
    if (onCityChange) onCityChange(city);
    setDropdownOpen(false);
    navigate(`/properties?city=${encodeURIComponent(city === 'All India' ? '' : city)}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & City Selector */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2.5">
              <img
                src="/ramlogics-logo.png"
                alt="Ramlogics"
                className="h-8 w-auto object-contain"
              />
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-100 text-brand-800 border border-brand-200 leading-none w-fit">
                  Realty
                </span>
                <span className="text-[9px] text-gray-400 font-semibold tracking-wider uppercase mt-0.5">
                  Real Estate Hub
                </span>
              </div>
            </Link>

            {/* City Dropdown */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 bg-gray-50 text-sm font-medium text-gray-700 transition"
              >
                <MapPin className="w-4 h-4 text-brand-600" />
                <span>{selectedCity}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-xl py-1 z-50">
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${
                        selectedCity === city ? 'font-bold text-brand-600 bg-brand-50' : 'text-gray-700'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-semibold text-gray-700">
            <Link to="/properties?listingType=buy" className="hover:text-brand-600 transition">
              Buy
            </Link>
            <Link to="/properties?listingType=rent" className="hover:text-brand-600 transition">
              Rent
            </Link>
            <Link to="/properties?listingType=commercial" className="hover:text-brand-600 transition">
              Commercial
            </Link>
            <Link to="/properties?listingType=plot" className="hover:text-brand-600 transition">
              Plots & Land
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-4">
            
            {/* Wishlist Link */}
            <Link
              to="/dashboard?tab=wishlist"
              className="p-2 text-gray-600 hover:text-red-500 hover:bg-gray-50 rounded-full transition relative"
              title="Saved Properties"
            >
              <Heart className="w-5 h-5" />
              {user?.savedProperties && user.savedProperties.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              )}
            </Link>

            {/* Post Property Free Button */}
            <Link
              to="/post-property"
              className="hidden sm:inline-flex items-center space-x-2 bg-gradient-to-r from-brand-600 to-brand-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-brand-500/20 hover:from-brand-700 hover:to-brand-600 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Property</span>
              <span className="bg-black/20 text-[10px] tracking-wide uppercase px-1.5 py-0.5 rounded font-black">
                FREE
              </span>
            </Link>

            {/* User Account / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-gray-100 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:inline-block max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-bold text-gray-800 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Dashboard & Listings
                    </Link>
                    <Link
                      to="/dashboard?tab=inquiries"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Inquiries Received
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 border-t border-gray-100"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1.5 text-sm font-bold text-gray-700 hover:text-brand-600 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-brand-500 transition"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
