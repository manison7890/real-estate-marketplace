import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  MessageSquare, 
  Eye, 
  CheckCircle2, 
  Star, 
  Trash2, 
  ShieldCheck, 
  Search, 
  ExternalLink, 
  Activity 
} from 'lucide-react';
import { Property } from '../types';
import { api, mockProperties } from '../services/api';
import { formatPrice } from '../utils/format';

interface AdminStats {
  totalProperties: number;
  verifiedProperties: number;
  featuredProperties: number;
  totalUsers: number;
  totalInquiries: number;
  totalViews: number;
}

interface AdminInquiryItem {
  _id: string;
  propertyTitle?: string;
  propertyId?: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: string;
  createdAt: string;
  property?: any;
}

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'users' | 'inquiries'>('overview');
  const [stats, setStats] = useState<AdminStats>({
    totalProperties: 5,
    verifiedProperties: 5,
    featuredProperties: 3,
    totalUsers: 3,
    totalInquiries: 3,
    totalViews: 1436,
  });

  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [users, setUsers] = useState<any[]>([
    { _id: 'u-1', name: 'Ramlogics Real Estate Admin', email: 'admin@ramlogics.com', role: 'admin', phone: '+91 99999 88888', createdAt: new Date().toISOString() },
    { _id: 'u-2', name: 'Rohit Sharma', email: 'rohit@ramlogics.com', role: 'agent', phone: '+91 98200 12345', createdAt: new Date().toISOString() },
    { _id: 'u-3', name: 'Priya Nair', email: 'priya.nair@gmail.com', role: 'owner', phone: '+91 98450 67890', createdAt: new Date().toISOString() },
  ]);
  const [inquiries, setInquiries] = useState<AdminInquiryItem[]>([
    {
      _id: 'inq-1',
      propertyTitle: 'Luxury 3 BHK Sea View Apartment in Worli',
      name: 'Amit Patel',
      phone: '+91 98211 44556',
      email: 'amit.patel@gmail.com',
      message: 'Looking to schedule a weekend site visit with family.',
      status: 'new',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'inq-2',
      propertyTitle: 'Spacious 2 BHK Apartment for Rent in Koramangala',
      name: 'Deepak Rao',
      phone: '+91 98765 11223',
      email: 'deepak.rao@infosys.com',
      message: 'Is the apartment available for immediate lease?',
      status: 'contacted',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'inq-3',
      propertyTitle: 'Modern 4 BHK Independent Villa in Golf Course Road',
      name: 'Siddharth Jain',
      phone: '+91 99110 99887',
      email: 'siddharth@jainholdings.com',
      message: 'Interested in making an offer. Please share payment schedule.',
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const [statsRes, propsRes, usersRes, inqRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/properties'),
          api.get('/admin/users'),
          api.get('/admin/inquiries'),
        ]);

        if (statsRes.data?.stats) setStats(statsRes.data.stats);
        if (propsRes.data?.properties) setProperties(propsRes.data.properties);
        if (usersRes.data?.users) setUsers(usersRes.data.users);
        if (inqRes.data?.inquiries) setInquiries(inqRes.data.inquiries);
      } catch (err) {
        console.log('Using simulated staging admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleToggleVerify = async (id: string) => {
    try {
      await api.patch(`/admin/properties/${id}/verify`);
      setProperties(properties.map(p => p._id === id ? { ...p, verified: !p.verified } : p));
    } catch {
      setProperties(properties.map(p => p._id === id ? { ...p, verified: !p.verified } : p));
    }
  };

  const handleToggleFeature = async (id: string) => {
    try {
      await api.patch(`/admin/properties/${id}/feature`);
      setProperties(properties.map(p => p._id === id ? { ...p, featured: !p.featured } : p));
    } catch {
      setProperties(properties.map(p => p._id === id ? { ...p, featured: !p.featured } : p));
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this property as Admin?')) return;
    try {
      await api.delete(`/admin/properties/${id}`);
      setProperties(properties.filter(p => p._id !== id));
    } catch {
      setProperties(properties.filter(p => p._id !== id));
    }
  };

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.locality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                  Ramlogics Realty Admin Control Panel
                </h1>
                <span className="bg-brand-100 text-brand-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-brand-200">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Full platform administration: property moderation, verification, leads, and user accounts.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/post-property"
              className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              + Post New Listing
            </Link>
            <Link
              to="/"
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition"
            >
              View Public Site ↗
            </Link>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200 mb-8 space-x-2">
          {[
            { id: 'overview', label: 'Overview & Metrics', icon: Activity },
            { id: 'properties', label: `Properties (${properties.length})`, icon: Building2 },
            { id: 'inquiries', label: `Lead Inquiries (${inquiries.length})`, icon: MessageSquare },
            { id: 'users', label: `Users & Agents (${users.length})`, icon: Users },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-3.5 px-6 font-bold text-sm border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-brand-600 text-brand-700 bg-white rounded-t-2xl shadow-sm'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Listings</span>
                  <h3 className="text-3xl font-black text-gray-900 mt-1">{stats.totalProperties}</h3>
                  <span className="text-[11px] font-bold text-brand-600 mt-1 block">
                    {stats.verifiedProperties} Verified RERA
                  </span>
                </div>
                <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Inquiries / Leads</span>
                  <h3 className="text-3xl font-black text-gray-900 mt-1">{stats.totalInquiries}</h3>
                  <span className="text-[11px] font-bold text-emerald-600 mt-1 block">Active Lead Capture</span>
                </div>
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Registered Users</span>
                  <h3 className="text-3xl font-black text-gray-900 mt-1">{stats.totalUsers}</h3>
                  <span className="text-[11px] font-bold text-gray-500 mt-1 block">Buyers, Owners & Agents</span>
                </div>
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Platform Impressions</span>
                  <h3 className="text-3xl font-black text-gray-900 mt-1">{stats.totalViews}</h3>
                  <span className="text-[11px] font-bold text-blue-600 mt-1 block">Listing Page Views</span>
                </div>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <Eye className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center justify-between">
                  <span>Recent Lead Inquiries</span>
                  <button onClick={() => setActiveTab('inquiries')} className="text-xs text-brand-600 font-bold hover:underline">
                    View All
                  </button>
                </h3>
                <div className="space-y-3">
                  {inquiries.slice(0, 3).map((inq) => (
                    <div key={inq._id} className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-gray-900">{inq.name} ({inq.phone})</p>
                        <p className="text-[11px] text-gray-500 truncate max-w-xs">{inq.propertyTitle || 'Property Inquiry'}</p>
                      </div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {inq.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center justify-between">
                  <span>Featured Properties</span>
                  <button onClick={() => setActiveTab('properties')} className="text-xs text-brand-600 font-bold hover:underline">
                    Manage
                  </button>
                </h3>
                <div className="space-y-3">
                  {properties.filter(p => p.featured).slice(0, 3).map((prop) => (
                    <div key={prop._id} className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                      <div className="truncate pr-3">
                        <p className="text-xs font-bold text-gray-900 truncate">{prop.title}</p>
                        <p className="text-[11px] text-gray-500">{prop.location.city} • {formatPrice(prop.price, prop.listingType)}</p>
                      </div>
                      <Link to={`/property/${prop._id}`} className="p-2 hover:bg-gray-200 rounded-lg text-gray-600">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Properties Management Tab */}
        {activeTab === 'properties' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter listings by city or title..."
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <span className="text-xs text-gray-500 font-medium">
                Showing {filteredProperties.length} of {properties.length} listings
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">Property</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Verified</th>
                    <th className="py-3 px-4">Featured</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {filteredProperties.map((prop) => (
                    <tr key={prop._id} className="hover:bg-gray-50/80 transition">
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="font-bold text-gray-900 truncate">{prop.title}</p>
                        <span className="text-[10px] text-gray-400 block">{prop.features.bedrooms} BHK • {prop.features.carpetAreaSqFt} sq.ft</span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">
                        {prop.location.locality}, {prop.location.city}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-brand-700">
                        {formatPrice(prop.price, prop.listingType)}
                      </td>
                      <td className="py-3.5 px-4 uppercase text-[10px] font-bold">
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                          {prop.listingType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleVerify(prop._id)}
                          className={`p-1.5 rounded-lg border transition ${
                            prop.verified
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                              : 'bg-gray-50 border-gray-200 text-gray-400'
                          }`}
                          title="Toggle Verification"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleFeature(prop._id)}
                          className={`p-1.5 rounded-lg border transition ${
                            prop.featured
                              ? 'bg-amber-50 border-amber-200 text-amber-500 fill-amber-500'
                              : 'bg-gray-50 border-gray-200 text-gray-400'
                          }`}
                          title="Toggle Featured"
                        >
                          <Star className={`w-4 h-4 ${prop.featured ? 'fill-current' : ''}`} />
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <Link
                          to={`/property/${prop._id}`}
                          className="p-1.5 inline-block text-gray-600 hover:text-brand-600 bg-gray-100 rounded-lg"
                          title="View Live Listing"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteProperty(prop._id)}
                          className="p-1.5 text-red-600 hover:text-red-800 bg-red-50 rounded-lg"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. Inquiries Tab */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-6">
            <h3 className="text-base font-black text-gray-900 mb-4">All Buyer &amp; Tenant Leads</h3>
            <div className="divide-y divide-gray-100">
              {inquiries.map((inq) => (
                <div key={inq._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-900 text-sm">{inq.name}</span>
                      <span className="text-xs text-brand-700 bg-brand-50 px-2 py-0.5 rounded font-bold">{inq.phone}</span>
                      <span className="text-xs text-gray-500">{inq.email}</span>
                    </div>
                    <p className="text-xs font-semibold text-gray-700">Property: {inq.propertyTitle || 'Listing'}</p>
                    <p className="text-xs text-gray-500 italic">"{inq.message}"</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href={`tel:${inq.phone}`}
                      className="px-3 py-1.5 bg-brand-600 text-white rounded-lg text-xs font-bold shadow-sm"
                    >
                      Call Lead
                    </a>
                    <a
                      href={`mailto:${inq.email}`}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200"
                    >
                      Send Email
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-6">
            <h3 className="text-base font-black text-gray-900 mb-4">Registered Platform Accounts</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 transition">
                      <td className="py-3 px-4 font-bold text-gray-900">{u.name}</td>
                      <td className="py-3 px-4 text-gray-600">{u.email}</td>
                      <td className="py-3 px-4 text-gray-600">{u.phone || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : u.role === 'agent'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        {new Date(u.createdAt || Date.now()).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
