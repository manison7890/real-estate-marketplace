import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Phone, Mail, ShieldCheck, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-gray-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-slate-800">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">100% Verified Listings</h4>
              <p className="text-xs text-gray-400 mt-0.5">Every property inspected for legitimate ownership & RERA compliance.</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">Direct Owner Contact</h4>
              <p className="text-xs text-gray-400 mt-0.5">Connect with genuine owners and zero brokerage options.</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">100,000+ Properties</h4>
              <p className="text-xs text-gray-400 mt-0.5">Apartments, villas, plots, and commercial spaces across India.</p>
            </div>
          </div>
        </div>

        {/* Brand Identity Block */}
        <div className="pt-10 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 bg-white px-3.5 py-2 rounded-xl shadow-sm">
            <img src="/ramlogics-logo.png" alt="Ramlogics" className="h-7 w-auto object-contain" />
            <span className="text-xs font-black uppercase tracking-wider text-brand-800 bg-brand-100 px-2 py-0.5 rounded border border-brand-200">
              Realty
            </span>
          </div>
          <p className="text-xs text-gray-400 max-w-md">
            Ramlogics Realty is India's next-generation property marketplace connecting home buyers, tenants, owners and agents with zero brokerage and verified listings.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          <div>
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Properties in India</h5>
            <ul className="space-y-2 text-sm">
              <li><Link to="/properties?city=Mumbai" className="hover:text-white transition">Flats in Mumbai</Link></li>
              <li><Link to="/properties?city=Bangalore" className="hover:text-white transition">Apartments in Bangalore</Link></li>
              <li><Link to="/properties?city=Delhi+NCR" className="hover:text-white transition">Flats in Delhi NCR</Link></li>
              <li><Link to="/properties?city=Pune" className="hover:text-white transition">Villas in Pune</Link></li>
              <li><Link to="/properties?city=Hyderabad" className="hover:text-white transition">Properties in Hyderabad</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Property Types</h5>
            <ul className="space-y-2 text-sm">
              <li><Link to="/properties?listingType=buy" className="hover:text-white transition">Residential Apartments</Link></li>
              <li><Link to="/properties?propertyType=Independent+House+/+Villa" className="hover:text-white transition">Independent Houses & Villas</Link></li>
              <li><Link to="/properties?listingType=plot" className="hover:text-white transition">Residential & NA Plots</Link></li>
              <li><Link to="/properties?listingType=commercial" className="hover:text-white transition">Commercial Office Spaces</Link></li>
              <li><Link to="/properties?propertyType=Builder+Floor" className="hover:text-white transition">Builder Floors</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h5>
            <ul className="space-y-2 text-sm">
              <li><Link to="/post-property" className="hover:text-white transition">Post Property Free</Link></li>
              <li><Link to="/properties?listingType=rent" className="hover:text-white transition">Rental Homes</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition">Owner Dashboard</Link></li>
              <li><Link to="/admin" className="hover:text-brand-400 font-bold transition flex items-center space-x-1"><span>Admin Control Panel</span></Link></li>
              <li><Link to="/login" className="hover:text-white transition">Agent Login</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Customer Care</h5>
            <p className="text-sm leading-relaxed mb-4">
              Toll Free support available Monday through Saturday 9:00 AM to 8:00 PM IST.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-brand-400" />
                <span>1800-120-7265 (Toll Free)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-brand-400" />
                <span>support@ramlogics.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© 2026 Ramlogics Realty India Pvt Ltd. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="hover:text-gray-400 cursor-pointer">Terms & Conditions</span>
            <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-400 cursor-pointer">RERA Disclaimer</span>
            <span className="hover:text-gray-400 cursor-pointer">Site Map</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
