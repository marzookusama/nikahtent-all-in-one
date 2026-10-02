import React, { useState, useMemo } from 'react';
import { 
  Store, 
  Star, 
  MapPin, 
  Phone, 
  Calendar, 
  Users, 
  PlusCircle, 
  ShieldCheck, 
  Check, 
  MessageCircle, 
  Sparkles, 
  X, 
  Camera, 
  UtensilsCrossed, 
  Armchair, 
  HeartHandshake, 
  ChefHat, 
  CheckCircle2, 
  Clock,
  Car,
  Building2,
  Lock,
  ShieldAlert,
  Eye,
  EyeOff,
  ThumbsUp,
  AlertTriangle
} from 'lucide-react';
import { VendorListing, VendorCategory, VendorBooking, VendorReview } from '../types';
import { getMuslimAvatar } from '../utils/avatars';

interface VendorHubProps {
  vendors: VendorListing[];
  bookings: VendorBooking[];
  onBookVendor: (booking: Omit<VendorBooking, 'id' | 'createdAt'>) => void;
  onRegisterVendor: (vendor: Omit<VendorListing, 'id' | 'reviews' | 'rating' | 'reviewCount'>) => void;
  onAddReview: (vendorId: string, review: Omit<VendorReview, 'id' | 'date'>) => void;
  currentUserId: string;
  currentUserName: string;
  currentUserGender?: 'male' | 'female';
  currentUserPhotoUrl?: string;
}

export const VendorHub: React.FC<VendorHubProps> = ({
  vendors,
  bookings,
  onBookVendor,
  onRegisterVendor,
  onAddReview,
  currentUserId,
  currentUserName,
  currentUserGender,
  currentUserPhotoUrl
}) => {
  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedVendor, setSelectedVendor] = useState<VendorListing | null>(null);
  const [bookingVendor, setBookingVendor] = useState<VendorListing | null>(null);
  const [showVendorRegistrationModal, setShowVendorRegistrationModal] = useState(false);
  const [reviewingVendor, setReviewingVendor] = useState<VendorListing | null>(null);
  const [blockedVendorForReview, setBlockedVendorForReview] = useState<VendorListing | null>(null);
  const [showMyBookingsDrawer, setShowMyBookingsDrawer] = useState(false);

  // Booking Form State
  const [eventDate, setEventDate] = useState('2026-11-20');
  const [guestCount, setGuestCount] = useState(250);
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(0);
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingSuccessMessage, setBookingSuccessMessage] = useState<string | null>(null);

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHoverRating, setReviewHoverRating] = useState<number | null>(null);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isAnonymousMode, setIsAnonymousMode] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string>('');
  const [selectedAspects, setSelectedAspects] = useState<string[]>([]);

  // Vendor Registration State
  const [regName, setRegName] = useState('');
  const [regBusinessName, setRegBusinessName] = useState('');
  const [regCategory, setRegCategory] = useState<VendorCategory>('beautician');
  const [regDistrict, setRegDistrict] = useState('Colombo');
  const [regAddress, setRegAddress] = useState('');
  const [regPhone, setRegPhone] = useState('+94 77 ');
  const [regStartingPrice, setRegStartingPrice] = useState(45000);
  const [regPriceUnit, setRegPriceUnit] = useState('per bridal package');
  const [regDescription, setRegDescription] = useState('');
  const [regPackageTitle, setRegPackageTitle] = useState('Signature Walima Package');
  const [regPackagePrice, setRegPackagePrice] = useState(65000);
  const [regPackageFeatures, setRegPackageFeatures] = useState('Full Bridal Styling, On-site setup, Halal certified service');

  const categories: { id: string; label: string; icon: any }[] = [
    { id: 'all', label: 'All Wedding Services', icon: Store },
    { id: 'wedding_hall', label: 'Wedding Halls & Venues', icon: Building2 },
    { id: 'car_rental', label: 'Car Rental & Bridal Hire', icon: Car },
    { id: 'beautician', label: 'Bridal Beauty & Mehndi', icon: Sparkles },
    { id: 'catering', label: 'Walima Catering & Feasts', icon: UtensilsCrossed },
    { id: 'stage_decor', label: 'Stages, Backdrops & Sofas', icon: HeartHandshake },
    { id: 'tent_chairs', label: 'Marquee Tents & Chairs', icon: Armchair },
    { id: 'photo_shooter', label: 'Photo & Cinematography', icon: Camera },
    { id: 'chef', label: 'Master Banquet Chefs', icon: ChefHat }
  ];

  const districts = ['All', 'Colombo', 'Kandy', 'Galle', 'Gampaha', 'Ampara', 'Kurunegala', 'Kalutara'];

  // Filtered vendors
  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      if (selectedCategory !== 'all' && v.category !== selectedCategory) return false;
      if (selectedDistrict !== 'All' && v.district !== selectedDistrict) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = v.name.toLowerCase().includes(query);
        const matchesBiz = v.businessName.toLowerCase().includes(query);
        const matchesDesc = v.description.toLowerCase().includes(query);
        if (!matchesName && !matchesBiz && !matchesDesc) return false;
      }

      return true;
    });
  }, [vendors, selectedCategory, selectedDistrict, searchQuery]);

  const handleConfirmBooking = () => {
    if (!bookingVendor) return;

    const pkg = bookingVendor.packages[selectedPackageIndex] || {
      title: 'Custom Inquired Package',
      priceLKR: bookingVendor.startingPriceLKR
    };

    onBookVendor({
      vendorId: bookingVendor.id,
      vendorName: bookingVendor.businessName,
      vendorCategory: bookingVendor.category,
      userId: currentUserId,
      userName: currentUserName,
      eventDate,
      guestCount: Number(guestCount),
      packageTitle: pkg.title,
      priceLKR: pkg.priceLKR,
      status: 'inquiry',
      notes: bookingNotes
    });

    setBookingSuccessMessage(`Your booking inquiry for ${bookingVendor.businessName} was sent! The vendor will contact you on WhatsApp / Phone.`);
    setTimeout(() => {
      setBookingVendor(null);
      setBookingSuccessMessage(null);
      setBookingNotes('');
    }, 2200);
  };

  const handleRegisterVendorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regBusinessName || !regPhone) return;

    onRegisterVendor({
      name: regName || 'Service Specialist',
      businessName: regBusinessName,
      category: regCategory,
      district: regDistrict,
      address: regAddress || `${regDistrict}, Sri Lanka`,
      startingPriceLKR: Number(regStartingPrice),
      priceUnit: regPriceUnit,
      portfolioImages: [
        regCategory === 'beautician'
          ? '/src/assets/images/vendor_bridal_beautician_1790450002054.jpg'
          : regCategory === 'catering'
          ? '/src/assets/images/vendor_wedding_buriyani_1790450027785.jpg'
          : regCategory === 'stage_decor' || regCategory === 'tent_chairs'
          ? '/src/assets/images/vendor_stage_tents_1790450015435.jpg'
          : regCategory === 'car_rental'
          ? '/src/assets/images/vendor_wedding_car_1790917678221.jpg'
          : regCategory === 'wedding_hall'
          ? '/src/assets/images/vendor_wedding_hall_1790918022795.jpg'
          : '/src/assets/images/vendor_photo_shooter_1790450039025.jpg'
      ],
      packages: [
        {
          id: `pkg_${Date.now()}`,
          title: regPackageTitle,
          priceLKR: Number(regPackagePrice),
          features: regPackageFeatures.split(',').map((f) => f.trim())
        }
      ],
      isVerified: true,
      subscriptionStatus: 'trial_active', // 6 MONTHS TOTALLY FREE TRIAL!
      trialDaysLeft: 180,
      description: regDescription || 'Professional Muslim wedding services with high quality and punctuality.',
      contactPhone: regPhone,
      whatsapp: regPhone.replace(/\D/g, ''),
      ownerId: currentUserId
    });

    setShowVendorRegistrationModal(false);
  };

  const getUserBookingsForVendor = (vendorId: string) => {
    return bookings.filter((b) => b.vendorId === vendorId && b.userId === currentUserId);
  };

  const hasUserBookedVendor = (vendorId: string) => {
    return getUserBookingsForVendor(vendorId).length > 0;
  };

  const getUserReviewForVendor = (vendor: VendorListing) => {
    return vendor.reviews.find((r) => r.userId === currentUserId);
  };

  const startReviewForVendor = (vendor: VendorListing, bookingId?: string) => {
    const userBookings = getUserBookingsForVendor(vendor.id);

    // GATE: User must have booked via this app to review
    if (userBookings.length === 0) {
      setBlockedVendorForReview(vendor);
      return;
    }

    setReviewingVendor(vendor);
    const targetBooking = bookingId 
      ? userBookings.find((b) => b.id === bookingId) || userBookings[0] 
      : userBookings[0];
    setSelectedBookingId(targetBooking?.id || '');

    const existingReview = vendor.reviews.find(
      (r) => r.userId === currentUserId || (bookingId && r.bookingId === bookingId)
    );

    if (existingReview) {
      setReviewRating(existingReview.rating);
      setReviewTitle(existingReview.title || '');
      setReviewComment(existingReview.comment.replace(/\n\nHighlights: .*$/, ''));
      setIsAnonymousMode(!!existingReview.isAnonymous);
    } else {
      setReviewRating(5);
      setReviewTitle('');
      setReviewComment('');
      setIsAnonymousMode(false);
      setSelectedAspects([]);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingVendor || !reviewComment.trim()) return;

    const userBookings = getUserBookingsForVendor(reviewingVendor.id);
    const chosenBooking = userBookings.find((b) => b.id === selectedBookingId) || userBookings[0];

    // Determine author name & avatar based on Anonymous Mode
    const authorDisplayName = isAnonymousMode ? 'Verified Client' : currentUserName;
    const authorAvatar = isAnonymousMode
      ? getMuslimAvatar(currentUserGender)
      : getMuslimAvatar(currentUserGender, currentUserPhotoUrl);

    const aspectsSuffix = selectedAspects.length > 0
      ? `\n\nHighlights: ${selectedAspects.join(' · ')}`
      : '';

    onAddReview(reviewingVendor.id, {
      author: authorDisplayName,
      rating: reviewRating,
      comment: reviewComment.trim() + aspectsSuffix,
      title: reviewTitle.trim() || undefined,
      isAnonymous: isAnonymousMode,
      avatarUrl: authorAvatar,
      bookingId: chosenBooking?.id,
      isVerifiedBooking: true,
      serviceBooked: chosenBooking ? chosenBooking.packageTitle : undefined,
      eventDate: chosenBooking ? chosenBooking.eventDate : undefined,
      userId: currentUserId
    });

    setReviewingVendor(null);
    setReviewComment('');
    setReviewTitle('');
    setSelectedAspects([]);
    setIsAnonymousMode(false);
    setReviewRating(5);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Marketplace Header Banner with 6-Month Free Trial Promo */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white p-6 sm:p-10 shadow-xl border border-emerald-900/60">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              All-In-One Nikah & Walima Services
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans'] leading-tight">
            Curated Sri Lankan Muslim Wedding Vendors & Event Services
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Connect with grand air-conditioned wedding halls & banquet venues, luxury wedding car rentals & bridal convoys, verified bridal makeup artists, authentic firewood Dum Buriyani caterers, marquee canopy tents, chairs, illuminated stage decor, and professional modest wedding photographers.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowVendorRegistrationModal(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Join as Vendor — 6 Months Totally Free</span>
            </button>
          </div>
        </div>

        {/* 6-Month Free Trial Badge Tag */}
        <div className="hidden lg:block absolute right-10 top-1/2 -translate-y-1/2 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center max-w-xs">
          <Clock className="w-8 h-8 text-amber-400 mx-auto mb-2" />
          <h4 className="font-bold text-sm text-white">6 Months Free Trial</h4>
          <p className="text-xs text-slate-300 mt-1">
            New wedding service vendors receive <strong>6 months 100% free visibility (180 days)</strong> across Sri Lanka before regular subscription applies.
          </p>
        </div>
      </div>

      {/* User's Verified Bookings & Reviews Banner */}
      {(() => {
        const myBookings = bookings.filter((b) => b.userId === currentUserId);
        if (myBookings.length === 0) return null;

        return (
          <div className="bg-emerald-50/80 dark:bg-emerald-950/40 rounded-2xl p-4 border border-emerald-200 dark:border-emerald-800/60 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-600 text-white shrink-0 shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                      Your Booked Wedding Services ({myBookings.length})
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300">
                      Verified Review Eligible
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    Only clients who booked via Nikahtent can rate vendors. You can publish under your name or choose <strong>Anonymous Mode</strong>.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowMyBookingsDrawer(!showMyBookingsDrawer)}
                className="px-4 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-xl hover:bg-emerald-50 dark:hover:bg-slate-800 shrink-0 transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                <span>{showMyBookingsDrawer ? 'Hide Bookings' : 'View & Rate Booked Vendors'}</span>
              </button>
            </div>

            {/* Expanded Bookings List with Rate & Review Action */}
            {showMyBookingsDrawer && (
              <div className="pt-2 border-t border-emerald-200/70 dark:border-emerald-800/40 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {myBookings.map((b) => {
                  const targetVendor = vendors.find((v) => v.id === b.vendorId);
                  const existingReview = targetVendor?.reviews.find(
                    (r) => r.userId === currentUserId || r.bookingId === b.id
                  );

                  return (
                    <div
                      key={b.id}
                      className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/60 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {b.vendorName}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase">
                            ({b.vendorCategory.replace('_', ' ')})
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {b.packageTitle} · Event: {b.eventDate}
                        </p>
                      </div>

                      <div className="shrink-0">
                        {existingReview ? (
                          <button
                            onClick={() => targetVendor && startReviewForVendor(targetVendor, b.id)}
                            className="px-3 py-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 rounded-lg hover:bg-emerald-100 flex items-center gap-1 transition-colors"
                          >
                            <Star className="w-3 h-3 fill-current text-amber-500" />
                            <span>Reviewed ({existingReview.rating}★) · Edit</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => targetVendor && startReviewForVendor(targetVendor, b.id)}
                            className="px-3 py-1.5 text-[11px] font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs flex items-center gap-1 transition-all"
                          >
                            <Star className="w-3 h-3 text-amber-300" />
                            <span>Rate & Review</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      {/* Filter and Categories Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        {/* Category Pill Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <input
            type="text"
            placeholder="Search vendors, packages, specialties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500"
          />

          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
          >
            {districts.map((d) => (
              <option key={d} value={d}>
                {d === 'All' ? 'All Districts across Sri Lanka' : `District: ${d}`}
              </option>
            ))}
          </select>

          <div className="flex items-center justify-end">
            <span className="text-xs text-slate-500 font-medium">
              Showing {filteredVendors.length} Verified Wedding Vendors
            </span>
          </div>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => {
          const mainImage = vendor.portfolioImages[0] || '/src/assets/images/hero_sri_lanka_nikah_1790449981525.jpg';

          return (
            <div
              key={vendor.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={mainImage}
                    alt={vendor.businessName}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-950/80 backdrop-blur-md text-white uppercase tracking-wider">
                      {vendor.category.replace('_', ' ')}
                    </span>

                    {vendor.subscriptionStatus === 'trial_active' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white shadow-xs">
                        6 Mo. Free Trial Active
                      </span>
                    )}
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/85 backdrop-blur-md text-amber-400 text-xs font-bold shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-white tabular-nums">{vendor.rating.toFixed(1)}</span>
                    <span className="text-slate-400 text-[10px]">({vendor.reviewCount} reviews)</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug line-clamp-1">
                      {vendor.businessName}
                    </h3>
                    {vendor.isVerified && (
                      <span title="Verified Service">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{vendor.address}</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed pt-1">
                    {vendor.description}
                  </p>

                  {/* Distinctive Feature Tags */}
                  {vendor.category === 'wedding_hall' && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] font-semibold border border-amber-500/20 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        <span>Capacity: {vendor.hallCapacity || 500}+ Pax</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                        AC · Segregated Dining
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[10px] font-semibold border border-blue-500/20">
                        Prayer Room
                      </span>
                    </div>
                  )}

                  {vendor.category === 'car_rental' && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] font-semibold border border-amber-500/20 flex items-center gap-1">
                        <Car className="w-3 h-3" />
                        <span>Chauffeur Included</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                        Fresh Floral Ribbon Decor
                      </span>
                    </div>
                  )}

                  {/* Packages Highlight */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between text-xs">
                    <span className="text-slate-400">Starting from</span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white tabular-nums">
                        LKR {vendor.startingPriceLKR.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-500">{vendor.priceUnit}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800 mt-2 space-y-2">
                {(() => {
                  const isBooked = hasUserBookedVendor(vendor.id);
                  const myRev = getUserReviewForVendor(vendor);
                  if (!isBooked) return null;

                  return (
                    <div className="flex items-center justify-between text-[11px] p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60">
                      <span className="text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Booked by you</span>
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startReviewForVendor(vendor);
                        }}
                        className="font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 underline flex items-center gap-1"
                      >
                        <Star className="w-3 h-3 fill-current text-amber-500" />
                        <span>{myRev ? `Your Review (${myRev.rating}★)` : 'Rate & Review'}</span>
                      </button>
                    </div>
                  );
                })()}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedVendor(vendor)}
                    className="flex-1 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                  >
                    View Details & Reviews
                  </button>

                  <button
                    onClick={() => setBookingVendor(vendor)}
                    className="flex-1 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book / Inquire</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Vendor Detail Modal with Reviews & Packages */}
      {selectedVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                  {selectedVendor.category.replace('_', ' ')}
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedVendor.businessName}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {selectedVendor.address}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-amber-500 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {selectedVendor.rating.toFixed(1)} ({selectedVendor.reviews.length} reviews)
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedVendor(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Gallery */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedVendor.portfolioImages.map((img, i) => (
                <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img src={img} alt="Portfolio item" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedVendor.description}
            </p>

            {/* Packages */}
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                Available Wedding Packages
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedVendor.packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2.5"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                        {pkg.title}
                      </h4>
                      <span className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400 tabular-nums">
                        LKR {pkg.priceLKR.toLocaleString()}
                      </span>
                    </div>

                    <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                      {pkg.features.map((f, fi) => (
                        <li key={fi} className="flex items-center gap-2">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Reviews Section with Booked-Only Protection & Anonymous Mode */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                      Verified Client Ratings & Reviews
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Booked Clients Only</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Reviews can only be posted by clients with confirmed Nikahtent bookings to ensure genuine, unbiased feedback.
                  </p>
                </div>

                <div>
                  {hasUserBookedVendor(selectedVendor.id) ? (
                    <button
                      onClick={() => startReviewForVendor(selectedVendor)}
                      className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-300" />
                      <span>{getUserReviewForVendor(selectedVendor) ? 'Edit Your Review' : '+ Write Verified Review'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setBlockedVendorForReview(selectedVendor)}
                      className="px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Review (Booked Clients Only)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Rating Summary Bar */}
              {selectedVendor.reviews.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                      {selectedVendor.rating.toFixed(1)}
                    </div>
                    <div>
                      <div className="flex items-center text-amber-500 text-xs">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-3.5 h-3.5 ${
                              idx < Math.round(selectedVendor.rating) ? 'fill-current' : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Based on {selectedVendor.reviews.length} verified app {selectedVendor.reviews.length === 1 ? 'booking' : 'bookings'}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/70 px-2.5 py-1 rounded-lg">
                    100% Verified Community Feedback
                  </span>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-3">
                {selectedVendor.reviews.length === 0 ? (
                  <div className="text-center py-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
                    <Star className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      No customer reviews yet.
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                      Have an upcoming event? Book {selectedVendor.businessName} to unlock verified review privileges!
                    </p>
                  </div>
                ) : (
                  selectedVendor.reviews.map((rev) => {
                    const avatarSrc = rev.avatarUrl || (rev.isAnonymous ? getMuslimAvatar('female') : getMuslimAvatar('male'));

                    return (
                      <div
                        key={rev.id}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={avatarSrc}
                              alt=""
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-xs text-slate-900 dark:text-white">
                                  {rev.isAnonymous ? 'Verified Client' : rev.author}
                                </span>
                                {rev.isAnonymous && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center gap-0.5">
                                    <EyeOff className="w-2.5 h-2.5" />
                                    <span>Anonymous Mode</span>
                                  </span>
                                )}
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-0.5">
                                  <CheckCircle2 className="w-2.5 h-2.5" />
                                  <span>Verified Booking</span>
                                </span>
                              </div>
                              {rev.serviceBooked && (
                                <p className="text-[10px] text-slate-400">
                                  Service: <span className="text-slate-600 dark:text-slate-300">{rev.serviceBooked}</span>
                                  {rev.eventDate && <span> · Event: {rev.eventDate}</span>}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="flex items-center text-amber-500 text-xs justify-end">
                              {Array.from({ length: rev.rating }).map((_, idx) => (
                                <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                              ))}
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{rev.date}</span>
                          </div>
                        </div>

                        {rev.title && (
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white pt-1">
                            {rev.title}
                          </h4>
                        )}

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {rev.comment}
                        </p>

                        {/* Vendor Reply Bubble */}
                        {rev.vendorReply && (
                          <div className="mt-2.5 p-3 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/40 border-l-4 border-emerald-600 dark:border-emerald-500 space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1">
                                <span>Response from {selectedVendor.businessName}</span>
                              </span>
                              <span className="text-[10px] text-emerald-700 dark:text-emerald-400">
                                {rev.vendorReply.date}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 dark:text-slate-300">
                              {rev.vendorReply.comment}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <a
                href={`https://wa.me/${selectedVendor.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 rounded-xl flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Vendor</span>
              </a>

              <button
                onClick={() => {
                  const v = selectedVendor;
                  setSelectedVendor(null);
                  setBookingVendor(v);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Book / Inquire Event</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Inquiry Modal */}
      {bookingVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Book {bookingVendor.businessName}
              </h3>
              <button
                onClick={() => setBookingVendor(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccessMessage ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{bookingSuccessMessage}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Select Service Package:
                  </label>
                  <select
                    value={selectedPackageIndex}
                    onChange={(e) => setSelectedPackageIndex(Number(e.target.value))}
                    className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  >
                    {bookingVendor.packages.map((pkg, i) => (
                      <option key={pkg.id} value={i}>
                        {pkg.title} — LKR {pkg.priceLKR.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Event Date:
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full p-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Expected Guests:
                    </label>
                    <input
                      type="number"
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full p-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Special Requirements or Venue Details:
                  </label>
                  <textarea
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="e.g. Venue in Dehiwala, timing after Maghrib, stage color theme gold & emerald..."
                    rows={3}
                    className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setBookingVendor(null)}
                    className="px-4 py-2 text-xs font-medium text-slate-500 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs"
                  >
                    Confirm Booking Inquiry
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Leave Verified Review Modal with Anonymous Mode & Aspect Tags */}
      {reviewingVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-0.5">
                  Verified Client Feedback
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Rate & Review {reviewingVendor.businessName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReviewingVendor(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Verified Booking Context Box */}
            {(() => {
              const userBookings = getUserBookingsForVendor(reviewingVendor.id);
              const chosenBooking = userBookings.find((b) => b.id === selectedBookingId) || userBookings[0];

              return (
                <div className="p-3 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold">Verified Nikahtent Booking Confirmed</span>
                  </div>

                  {userBookings.length > 1 ? (
                    <div>
                      <label className="text-[11px] font-medium text-slate-600 dark:text-slate-300 block mb-1">
                        Select which event booking you are reviewing:
                      </label>
                      <select
                        value={selectedBookingId}
                        onChange={(e) => setSelectedBookingId(e.target.value)}
                        className="w-full p-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-slate-900 dark:text-white outline-none"
                      >
                        {userBookings.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.packageTitle} (Event Date: {b.eventDate})
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : chosenBooking ? (
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
                      <span className="font-semibold">{chosenBooking.packageTitle}</span>
                      <span className="text-slate-500">Event: {chosenBooking.eventDate}</span>
                    </div>
                  ) : null}
                </div>
              );
            })()}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Star Rating Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Overall Rating:
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= (reviewHoverRating !== null ? reviewHoverRating : reviewRating);
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setReviewHoverRating(star)}
                        onMouseLeave={() => setReviewHoverRating(null)}
                        onClick={() => setReviewRating(star)}
                        className="p-1 text-amber-500 hover:scale-115 transition-all"
                        aria-label={`Rate ${star} star`}
                      >
                        <Star className={`w-7 h-7 ${isFilled ? 'fill-current' : 'text-slate-300 dark:text-slate-600'}`} />
                      </button>
                    );
                  })}
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 ml-2">
                    {reviewRating === 5 && '⭐⭐⭐⭐⭐ 5.0 - Exceptional!'}
                    {reviewRating === 4 && '⭐⭐⭐⭐ 4.0 - Very Good'}
                    {reviewRating === 3 && '⭐⭐⭐ 3.0 - Good / Satisfactory'}
                    {reviewRating === 2 && '⭐⭐ 2.0 - Below Expectations'}
                    {reviewRating === 1 && '⭐ 1.0 - Poor Experience'}
                  </span>
                </div>
              </div>

              {/* Anonymous Mode Switch */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isAnonymousMode ? (
                      <EyeOff className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Eye className="w-4 h-4 text-slate-500" />
                    )}
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Post Review Anonymously
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                        Hide your real identity. Review displays under &quot;Verified Client&quot; with a modest Muslim avatar.
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAnonymousMode(!isAnonymousMode)}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                      isAnonymousMode ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`block w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                        isAnonymousMode ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Real-time Reviewer Preview Box */}
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        isAnonymousMode
                          ? getMuslimAvatar(currentUserGender)
                          : getMuslimAvatar(currentUserGender, currentUserPhotoUrl)
                      }
                      alt=""
                      className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {isAnonymousMode ? 'Verified Client' : currentUserName}
                        </span>
                        {isAnonymousMode && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            Anonymous
                          </span>
                        )}
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                          ✓ Verified Booking
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        Preview of how your author identity will appear publicly
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Aspect Highlights Chips */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Quick Service Highlights (Optional):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Punctual Delivery & Timing',
                    'Modest Islamic Etiquette',
                    'Delicious Authentic Taste',
                    'Top Quality Decor / Setup',
                    'Value for Money',
                    'Smooth Communication'
                  ].map((aspect) => {
                    const isSelected = selectedAspects.includes(aspect);
                    return (
                      <button
                        key={aspect}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedAspects(selectedAspects.filter((a) => a !== aspect));
                          } else {
                            setSelectedAspects([...selectedAspects, aspect]);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                          isSelected
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {aspect}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Review Headline / Title */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Review Headline:
                </label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Exceptional bridal draping & punctual arrival!"
                  className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                />
              </div>

              {/* Detailed Experience */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Your Detailed Review & Feedback:
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details about punctuality, food taste, hijab styling durability, vehicle comfort, or stage lighting..."
                  rows={4}
                  required
                  className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setReviewingVendor(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-500 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>Publish Verified Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blocked Review Gate Notice Modal (When non-booked user tries to review) */}
      {blockedVendorForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center shadow-xs">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Verified Booking Required to Review
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                To guarantee 100% authentic community feedback and protect Muslim couples and families from fake or unverified testimonials, reviews can only be submitted by clients who have booked through <strong>Nikahtent</strong>.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-left text-xs space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 dark:text-white">
                  {blockedVendorForReview.businessName}
                </span>
                <span className="text-[10px] text-slate-400 uppercase">
                  {blockedVendorForReview.category.replace('_', ' ')}
                </span>
              </div>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                No active or confirmed booking on file with your account.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <button
                type="button"
                onClick={() => setBlockedVendorForReview(null)}
                className="w-full sm:flex-1 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = blockedVendorForReview;
                  setBlockedVendorForReview(null);
                  setSelectedVendor(null);
                  setBookingVendor(target);
                }}
                className="w-full sm:flex-1 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book This Vendor</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vendor Self-Registration Modal with 2-Month Free Trial terms */}
      {showVendorRegistrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                    <Store className="w-5 h-5" />
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Vendor Partner Registration
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  List your bridal, catering, stage, tent, or photography services on Nikahtent.
                </p>
              </div>
              <button
                onClick={() => setShowVendorRegistrationModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2 Months Free Banner */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-sm block">
                  🎉 Special Launch Offer: 2 Months 100% Free Trial!
                </span>
                <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed">
                  All new wedding vendor partners receive 60 days of full, unthrottled visibility on Nikahtent completely free of charge. After the 2-month trial period, a simple monthly subscription applies to maintain featured visibility.
                </p>
              </div>
            </div>

            <form onSubmit={handleRegisterVendorSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Farzana / Rameez"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Business / Brand Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Al-Noor Bridal Studio & Tents"
                    value={regBusinessName}
                    onChange={(e) => setRegBusinessName(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Service Category
                  </label>
                  <select
                    value={regCategory}
                    onChange={(e) => setRegCategory(e.target.value as VendorCategory)}
                    className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="wedding_hall">Wedding Halls & Banquet Venues</option>
                    <option value="car_rental">Wedding Car Rental & Bridal Hire</option>
                    <option value="beautician">Bridal Beautician & Makeup</option>
                    <option value="catering">Wedding Catering & Walima Feasts</option>
                    <option value="stage_decor">Stage Decor & Luxury Sofas</option>
                    <option value="tent_chairs">Marquee Tents & Chair Hire</option>
                    <option value="photo_shooter">Wedding Photography & Cinematics</option>
                    <option value="chef">Master Banquet Chef</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Primary District
                  </label>
                  <select
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  >
                    {districts.filter((d) => d !== 'All').map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Contact Phone & WhatsApp
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+94 77 123 4567"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Starting Price in LKR
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      required
                      value={regStartingPrice}
                      onChange={(e) => setRegStartingPrice(Number(e.target.value))}
                      className="w-1/2 p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                    />
                    <input
                      type="text"
                      placeholder="e.g. per package / plate"
                      value={regPriceUnit}
                      onChange={(e) => setRegPriceUnit(e.target.value)}
                      className="w-1/2 p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Service Description & Specialties
                </label>
                <textarea
                  value={regDescription}
                  onChange={(e) => setRegDescription(e.target.value)}
                  placeholder="Detail your equipment, culinary specialties, modesty standards, or marquee tent capacity..."
                  rows={3}
                  className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                />
              </div>

              {/* Package Setup */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Initial Showcase Package
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Package Title (e.g. Grand Walima)"
                    value={regPackageTitle}
                    onChange={(e) => setRegPackageTitle(e.target.value)}
                    className="p-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Price (LKR)"
                    value={regPackagePrice}
                    onChange={(e) => setRegPackagePrice(Number(e.target.value))}
                    className="p-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Features (comma separated: e.g. Full Airbrush, Hijab Pinning, Touch-up)"
                  value={regPackageFeatures}
                  onChange={(e) => setRegPackageFeatures(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVendorRegistrationModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-500 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md"
                >
                  Publish Listing (Activate 6-Month Free Trial)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
