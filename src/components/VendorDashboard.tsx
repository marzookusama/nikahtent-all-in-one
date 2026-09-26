import React, { useState } from 'react';
import { 
  Store, 
  Clock, 
  Calendar, 
  Users, 
  Star, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Plus, 
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { VendorListing, VendorBooking, VendorPackage } from '../types';

interface VendorDashboardProps {
  currentVendor: VendorListing;
  bookings: VendorBooking[];
  onUpdateBookingStatus: (bookingId: string, status: 'confirmed' | 'declined' | 'completed') => void;
  onAddPackage: (vendorId: string, pkg: Omit<VendorPackage, 'id'>) => void;
}

export const VendorDashboard: React.FC<VendorDashboardProps> = ({
  currentVendor,
  bookings,
  onUpdateBookingStatus,
  onAddPackage
}) => {
  const [showAddPackageModal, setShowAddPackageModal] = useState(false);
  const [pkgTitle, setPkgTitle] = useState('');
  const [pkgPrice, setPkgPrice] = useState(65000);
  const [pkgFeatures, setPkgFeatures] = useState('');

  // Filter bookings for this vendor
  const vendorBookings = bookings.filter((b) => b.vendorId === currentVendor.id);

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgTitle || !pkgPrice) return;

    onAddPackage(currentVendor.id, {
      title: pkgTitle,
      priceLKR: Number(pkgPrice),
      features: pkgFeatures.split(',').map((f) => f.trim()).filter(Boolean)
    });

    setShowAddPackageModal(false);
    setPkgTitle('');
    setPkgPrice(65000);
    setPkgFeatures('');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* 2-Month Free Trial Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 to-teal-950 text-white border border-emerald-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-amber-400 text-slate-950 font-bold text-xs uppercase px-2 py-0.5">
              Vendor Studio
            </span>
            <span className="text-xs text-emerald-300 font-semibold">
              {currentVendor.businessName}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans']">
            {currentVendor.subscriptionStatus === 'trial_active'
              ? `🎉 ${currentVendor.trialDaysLeft} Days Remaining on 2-Month Free Trial`
              : 'Active Featured Vendor Subscription'}
          </h2>
          <p className="text-xs text-slate-300 max-w-xl">
            Enjoy zero-commission wedding bookings, direct client inquiries, verified reviews, and unlimited package listings across Sri Lanka.
          </p>
        </div>

        <div className="text-right sm:text-center p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
          <span className="text-[10px] text-slate-300 uppercase block font-semibold">Listing Status</span>
          <span className="text-sm font-bold text-amber-300">
            {currentVendor.subscriptionStatus === 'trial_active' ? 'Free Trial (Active)' : 'Subscribed'}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase">
            Inquiries & Bookings
          </span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums mt-1 block">
            {vendorBookings.length}
          </span>
          <span className="text-[10px] text-emerald-600 font-medium">
            {vendorBookings.filter((b) => b.status === 'inquiry').length} pending response
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase">
            Client Rating
          </span>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-5 h-5 text-amber-400 fill-current" />
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {currentVendor.rating.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 ml-1">({currentVendor.reviewCount} reviews)</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            100% verified booking feedback
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase">
            Starting Price
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xs text-slate-400">LKR</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {currentVendor.startingPriceLKR.toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            {currentVendor.priceUnit}
          </span>
        </div>
      </div>

      {/* Booking Inquiries Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Client Booking Inquiries & Event Dates
            </h3>
            <p className="text-xs text-slate-500">
              Review and confirm wedding dates requested by Nikahtent members.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Client & Date</th>
                <th className="p-3.5">Package Requested</th>
                <th className="p-3.5">Guest Count</th>
                <th className="p-3.5">Price (LKR)</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {vendorBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 text-xs">
                    No booking inquiries received yet. Clients booking through Nikahtent will appear here.
                  </td>
                </tr>
              ) : (
                vendorBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {b.userName}
                      </span>
                      <span className="text-[11px] text-emerald-600 font-medium">
                        Wedding Date: {b.eventDate}
                      </span>
                      {b.notes && (
                        <p className="text-[10px] text-slate-400 italic mt-0.5">"{b.notes}"</p>
                      )}
                    </td>

                    <td className="p-3.5 font-medium text-slate-700 dark:text-slate-300">
                      {b.packageTitle}
                    </td>

                    <td className="p-3.5 tabular-nums text-slate-600 dark:text-slate-400">
                      {b.guestCount} pax
                    </td>

                    <td className="p-3.5 font-bold text-slate-900 dark:text-white tabular-nums">
                      LKR {b.priceLKR.toLocaleString()}
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : b.status === 'completed'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : b.status === 'declined'
                            ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    <td className="p-3.5 text-right space-x-2">
                      {b.status === 'inquiry' && (
                        <>
                          <button
                            onClick={() => onUpdateBookingStatus(b.id, 'declined')}
                            className="text-xs text-red-500 hover:text-red-600 px-2 py-1 rounded"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => onUpdateBookingStatus(b.id, 'confirmed')}
                            className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs"
                          >
                            Confirm Booking
                          </button>
                        </>
                      )}
                      {b.status === 'confirmed' && (
                        <button
                          onClick={() => onUpdateBookingStatus(b.id, 'completed')}
                          className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg"
                        >
                          Mark Completed
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Package Management */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Service Packages & Pricing
            </h3>
            <p className="text-xs text-slate-500">
              Customize packages visible to engaged couples and families in Sri Lanka.
            </p>
          </div>
          <button
            onClick={() => setShowAddPackageModal(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Package</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentVendor.packages.map((pkg) => (
            <div
              key={pkg.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  {pkg.title}
                </h4>
                <span className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400 tabular-nums">
                  LKR {pkg.priceLKR.toLocaleString()}
                </span>
              </div>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                {pkg.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Add Package Modal */}
      {showAddPackageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Create Service Package
            </h3>

            <form onSubmit={handleCreatePackage} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Package Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Walima Catering / Bridal Airbrush"
                  value={pkgTitle}
                  onChange={(e) => setPkgTitle(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Package Price in LKR:
                </label>
                <input
                  type="number"
                  required
                  value={pkgPrice}
                  onChange={(e) => setPkgPrice(Number(e.target.value))}
                  className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Features (comma separated):
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. HD Makeup, Hijab drape, Touchup kit, 2 assistants"
                  value={pkgFeatures}
                  onChange={(e) => setPkgFeatures(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPackageModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-500 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl"
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
