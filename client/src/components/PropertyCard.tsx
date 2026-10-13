import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, BedDouble, Bath, Maximize2, ShieldCheck, Eye, Phone } from 'lucide-react';
import { Property } from '../types';
import { formatPrice, formatArea } from '../utils/format';
import { useAuth } from '../context/AuthContext';

interface PropertyCardProps {
  property: Property;
  onContactClick?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onContactClick }) => {
  const { toggleWishlist, isWishlisted } = useAuth();
  const saved = isWishlisted(property._id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(property._id);
  };

  const primaryPhoto = property.photos && property.photos.length > 0
    ? property.photos[0]
    : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group bg-white rounded-2xl border border-gray-200/90 hover:border-brand-500/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Top Image & Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <Link to={`/property/${property._id}`}>
          <img
            src={primaryPhoto}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center z-10">
          <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm ${
            property.listingType === 'rent'
              ? 'bg-amber-500 text-white'
              : property.listingType === 'commercial'
              ? 'bg-indigo-600 text-white'
              : property.listingType === 'plot'
              ? 'bg-emerald-600 text-white'
              : 'bg-brand-600 text-white'
          }`}>
            For {property.listingType}
          </span>

          {property.verified && (
            <span className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-1 rounded-md flex items-center space-x-1 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified</span>
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-md z-10 ${
            saved
              ? 'bg-red-500 text-white scale-110'
              : 'bg-white/80 hover:bg-white text-gray-700 hover:text-red-500'
          }`}
          title={saved ? 'Remove from wishlist' : 'Save property'}
        >
          <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
        </button>

        {/* Price & Furnishing Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10">
          <div>
            <span className="text-xl sm:text-2xl font-black text-white drop-shadow-md">
              {formatPrice(property.price, property.listingType)}
            </span>
            {property.priceNegotiable && (
              <span className="block text-[10px] text-emerald-300 font-semibold tracking-wide">
                • Negotiable
              </span>
            )}
          </div>
          <span className="text-[11px] font-bold text-gray-200 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/20">
            {property.propertyType}
          </span>
        </div>
      </div>

      {/* Body Information */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <Link to={`/property/${property._id}`}>
            <h3 className="text-base font-bold text-gray-900 group-hover:text-brand-600 transition line-clamp-1 mb-1">
              {property.title}
            </h3>
          </Link>

          {/* Location */}
          <div className="flex items-center text-xs text-gray-500 mb-3 space-x-1">
            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="truncate">
              {property.location.locality}, {property.location.city}
            </span>
          </div>

          {/* Specifications Pills */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-gray-50 rounded-xl text-center border border-gray-100 mb-4">
            {property.listingType !== 'plot' && (
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center space-x-1 text-gray-400 mb-0.5">
                  <BedDouble className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-semibold uppercase">Config</span>
                </div>
                <span className="text-xs font-bold text-gray-800">
                  {property.features.bedrooms > 0 ? `${property.features.bedrooms} BHK` : 'Office'}
                </span>
              </div>
            )}

            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center space-x-1 text-gray-400 mb-0.5">
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="text-[10px] font-semibold uppercase">Carpet</span>
              </div>
              <span className="text-xs font-bold text-gray-800">
                {formatArea(property.features.carpetAreaSqFt)}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center space-x-1 text-gray-400 mb-0.5">
                <Bath className="w-3.5 h-3.5" />
                <span className="text-[10px] font-semibold uppercase">Status</span>
              </div>
              <span className="text-xs font-bold text-gray-800 truncate max-w-[80px]">
                {property.features.possessionStatus || 'Ready'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Contact Actions */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs text-gray-400">
            <Eye className="w-3.5 h-3.5" />
            <span>{property.viewsCount} views</span>
          </div>

          <div className="flex space-x-2">
            <Link
              to={`/property/${property._id}`}
              className="text-xs font-bold text-gray-700 hover:text-brand-600 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-brand-500 transition"
            >
              Details
            </Link>
            <button
              onClick={() => onContactClick ? onContactClick(property) : null}
              className="inline-flex items-center space-x-1 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 rounded-lg shadow-sm transition"
            >
              <Phone className="w-3 h-3" />
              <span>Contact</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
