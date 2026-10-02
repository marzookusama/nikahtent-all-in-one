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
  AlertCircle,
  Flag,
  ShieldAlert,
  EyeOff,
  Send,
  X
} from 'lucide-react';
import { VendorListing, VendorBooking, VendorPackage, VendorReview } from '../types';
import { getMuslimAvatar } from '../utils/avatars';

interface VendorDashboardProps {
  currentVendor: VendorListing;
  allVendors?: VendorListing[];
  onSelectVendor?: (vendorId: string) => void;
  bookings: VendorBooking[];
  onUpdateBookingStatus: (bookingId: string, status: 'confirmed' | 'declined' | 'completed') => void;
  onAddPackage: (vendorId: string, pkg: Omit<VendorPackage, 'id'>) => void;
  onDisputeReview?: (vendorId: string, reviewId: string, disputeReason: string) => void;
  onReplyToReview?: (vendorId: string, reviewId: string, replyComment: string) => void;
}

export const VendorDashboard: React.FC<VendorDashboardProps> = ({
  currentVendor,
  allVendors,
  onSelectVendor,
  bookings,
  onUpdateBookingStatus,
  onAddPackage,
  onDisputeReview,
  onReplyToReview
}) => {
  const [showAddPackageModal, setShowAddPackageModal] = useState(false);
  const [pkgTitle, setPkgTitle] = useState('');
  const [pkgPrice, setPkgPrice] = useState(65000);
  const [pkgFeatures, setPkgFeatures] = useState('');

  // Dispute Review Modal State
  const [disputingReview, setDisputingReview] = useState<VendorReview | null>(null);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeSuccessMessage, setDisputeSuccessMessage] = useState<string | null>(null);

  // Vendor Reply State
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyComment, setReplyComment] = useState('');

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
      {/* 6-Month Free Trial Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 to-teal-950 text-white border border-emerald-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-1 rounded-md bg-amber-400 text-slate-950 font-bold text-xs uppercase px-2 py-0.5">
              Vendor Studio
            </span>
            <span className="text-xs text-emerald-300 font-semibold">
              {currentVendor.businessName}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 uppercase font-medium">
              {currentVendor.category.replace('_', ' ')}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans']">
            {currentVendor.subscriptionStatus === 'trial_active'
              ? `🎉 ${currentVendor.trialDaysLeft} Days Remaining on 6-Month Free Launch Trial`
              : 'Active Featured Vendor Subscription'}
          </h2>
          <p className="text-xs text-slate-300 max-w-xl">
            Enjoy zero-commission wedding bookings, direct client inquiries, verified reviews, and unlimited package listings across Sri Lanka during the 6-month launch promotional phase.
          </p>

          {allVendors && allVendors.length > 1 && onSelectVendor && (
            <div className="pt-2 flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">Switch Active Studio:</span>
              <select
                value={currentVendor.id}
                onChange={(e) => onSelectVendor(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-xl bg-slate-900/90 border border-emerald-500/50 text-white font-medium outline-none"
              >
                {allVendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.businessName} ({v.category.replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="text-right sm:text-center p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shrink-0">
          <span className="text-[10px] text-slate-300 uppercase block font-semibold">Listing Status</span>
          <span className="text-sm font-bold text-amber-300">
            {currentVendor.subscriptionStatus === 'trial_active' ? 'Free Launch Trial' : 'Subscribed'}
          </span>
          <span className="text-[10px] text-slate-300 block mt-0.5">
            6 Months Zero Cost (180 Days)
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

      {/* Client Ratings & Verified Reviews Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Client Reviews & Verified Booking Ratings ({currentVendor.reviews.length})
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                100% App Bookings
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Genuine feedback from couples & families who booked {currentVendor.businessName}. You can reply to clients or request admin dispute removal for false claims.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 font-bold text-xs">
              <Star className="w-4 h-4 fill-current text-amber-500" />
              <span>{currentVendor.rating.toFixed(1)} Rating Score</span>
            </div>
          </div>
        </div>

        {/* Dispute Success Toast / Alert */}
        {disputeSuccessMessage && (
          <div className="mx-5 my-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{disputeSuccessMessage}</span>
            </div>
            <button
              onClick={() => setDisputeSuccessMessage(null)}
              className="text-emerald-600 hover:text-emerald-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="p-5 space-y-4">
          {currentVendor.reviews.length === 0 ? (
            <div className="text-center py-8 text-slate-400 space-y-1">
              <Star className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-xs font-semibold">No reviews on this listing yet.</p>
              <p className="text-[11px] text-slate-400">
                Clients who complete bookings through Nikahtent will be prompted to leave verified reviews.
              </p>
            </div>
          ) : (
            currentVendor.reviews.map((rev) => {
              const avatarSrc = rev.avatarUrl || (rev.isAnonymous ? getMuslimAvatar('female') : getMuslimAvatar('male'));
              const isReplying = replyingReviewId === rev.id;

              return (
                <div
                  key={rev.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={avatarSrc}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            {rev.isAnonymous ? 'Verified Client (Private / Anonymous)' : rev.author}
                          </span>
                          {rev.isAnonymous && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center gap-0.5">
                              <EyeOff className="w-2.5 h-2.5" />
                              <span>Anonymous Mode</span>
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Verified App Booking</span>
                          </span>
                        </div>

                        {rev.serviceBooked && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Booked: <span className="text-slate-700 dark:text-slate-300 font-medium">{rev.serviceBooked}</span>
                            {rev.eventDate && <span> · Event: {rev.eventDate}</span>}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0">
                      <div className="flex items-center text-amber-500 text-xs">
                        {Array.from({ length: rev.rating }).map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>
                  </div>

                  {rev.title && (
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                      {rev.title}
                    </h4>
                  )}

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {rev.comment}
                  </p>

                  {/* Dispute Status Banner if Active */}
                  {rev.disputeStatus === 'pending_admin_review' && (
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold text-[11px]">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Removal Request Pending Admin Review</span>
                        {rev.disputeRequestedAt && (
                          <span className="text-[10px] text-amber-600 font-normal">({rev.disputeRequestedAt})</span>
                        )}
                      </div>
                      {rev.disputeReason && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-300">
                          <strong>Your dispute claim:</strong> &quot;{rev.disputeReason}&quot;
                        </p>
                      )}
                    </div>
                  )}

                  {rev.disputeStatus === 'dismissed' && (
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Admin Investigation: Review was verified as genuine feedback from a booked client.</span>
                    </div>
                  )}

                  {/* Existing Vendor Reply */}
                  {rev.vendorReply ? (
                    <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border-l-4 border-emerald-600 dark:border-emerald-500 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-emerald-900 dark:text-emerald-300">
                          Your Studio Response
                        </span>
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400">{rev.vendorReply.date}</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300">
                        {rev.vendorReply.comment}
                      </p>
                    </div>
                  ) : (
                    /* Inline Vendor Reply Form */
                    isReplying && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2">
                        <textarea
                          rows={2}
                          value={replyComment}
                          onChange={(e) => setReplyComment(e.target.value)}
                          placeholder="Write a courteous public reply thanking the client or addressing their feedback..."
                          className="w-full p-2.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setReplyingReviewId(null);
                              setReplyComment('');
                            }}
                            className="px-3 py-1.5 text-xs text-slate-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              if (!replyComment.trim() || !onReplyToReview) return;
                              onReplyToReview(currentVendor.id, rev.id, replyComment.trim());
                              setReplyingReviewId(null);
                              setReplyComment('');
                            }}
                            className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            <span>Post Reply</span>
                          </button>
                        </div>
                      </div>
                    )
                  )}

                  {/* Review Actions: Reply & Request Removal */}
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                    {!rev.vendorReply && !isReplying && (
                      <button
                        onClick={() => {
                          setReplyingReviewId(rev.id);
                          setReplyComment('');
                        }}
                        className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Reply to Client</span>
                      </button>
                    )}

                    {rev.vendorReply && <div />}

                    {rev.disputeStatus !== 'pending_admin_review' ? (
                      <button
                        onClick={() => {
                          setDisputingReview(rev);
                          setDisputeReason('');
                        }}
                        className="text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 text-[11px] font-medium"
                      >
                        <Flag className="w-3 h-3" />
                        <span>Request Admin Removal (Report False)</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                        Removal under review
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Dispute / False Review Removal Request Modal */}
      {disputingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Request Review Removal
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Report a false or defamatory review for admin factual review.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDisputingReview(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">
                  Review by: {disputingReview.author}
                </span>
                <span className="text-amber-500 font-bold">{disputingReview.rating}★</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 line-clamp-2">
                &quot;{disputingReview.comment}&quot;
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!disputeReason.trim() || !onDisputeReview) return;
                onDisputeReview(currentVendor.id, disputingReview.id, disputeReason.trim());
                setDisputeSuccessMessage(
                  `Your removal request for review #${disputingReview.id.slice(-6)} has been submitted to Admin Compliance for factual audit.`
                );
                setDisputingReview(null);
                setDisputeReason('');
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Why is this review factually false or invalid?
                </label>
                <textarea
                  required
                  rows={4}
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="Provide concrete facts (e.g. GPS logs prove on-time arrival, client confused booking with third party, defamatory untrue claim about halal compliance)..."
                  className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setDisputingReview(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-500 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs"
                >
                  Submit Dispute to Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
