import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Store, 
  FileCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sliders, 
  Layers, 
  Activity, 
  Search, 
  Eye, 
  Edit3, 
  Save, 
  Check, 
  Clock, 
  ArrowUpRight,
  Sparkles,
  Zap,
  Filter,
  Car,
  Building2,
  PlusCircle,
  CreditCard,
  Gift,
  ToggleLeft,
  ToggleRight,
  X,
  Trash2,
  ShieldAlert,
  Star,
  MessageSquare,
  Flag,
  EyeOff
} from 'lucide-react';
import { 
  ImageModerationItem, 
  SubscriptionPlanConfig, 
  UserActivityLog, 
  UserProfile, 
  VendorListing 
} from '../types';
import { getMuslimAvatar } from '../utils/avatars';

interface AdminPortalProps {
  moderationQueue: ImageModerationItem[];
  onApproveImage: (itemId: string) => void;
  onRejectImage: (itemId: string, reason: string) => void;
  subscriptionPlans: SubscriptionPlanConfig[];
  onUpdatePlan: (updatedPlan: SubscriptionPlanConfig) => void;
  onCreatePlan?: (newPlan: SubscriptionPlanConfig) => void;
  activityLogs: UserActivityLog[];
  profiles: UserProfile[];
  onToggleUserVerification: (userId: string) => void;
  onToggleUserBan: (userId: string) => void;
  vendors: VendorListing[];
  onToggleVendorVerified: (vendorId: string) => void;
  onGrantVendorTrialDays?: (vendorId: string, additionalDays: number) => void;
  onGrantAllVendorsTrialDays?: (days: number) => void;
  isPlatformChargingActive?: boolean;
  onTogglePlatformCharging?: () => void;
  globalTrialMonths?: number;
  onUpdateGlobalTrialMonths?: (months: number) => void;
  onRemoveVendorReview?: (vendorId: string, reviewId: string, adminReason?: string) => void;
  onDismissReviewDispute?: (vendorId: string, reviewId: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  moderationQueue,
  onApproveImage,
  onRejectImage,
  subscriptionPlans,
  onUpdatePlan,
  onCreatePlan,
  activityLogs,
  profiles,
  onToggleUserVerification,
  onToggleUserBan,
  vendors,
  onToggleVendorVerified,
  onGrantVendorTrialDays,
  onGrantAllVendorsTrialDays,
  isPlatformChargingActive,
  onTogglePlatformCharging,
  globalTrialMonths,
  onUpdateGlobalTrialMonths,
  onRemoveVendorReview,
  onDismissReviewDispute
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'moderation' | 'plans' | 'users' | 'vendors' | 'activity'>('plans');

  // Vendor Review Disputes & Moderation State
  const [vendorSubTab, setVendorSubTab] = useState<'directory' | 'disputes'>('directory');
  const [inspectingVendorReviews, setInspectingVendorReviews] = useState<VendorListing | null>(null);
  const [reviewToRemove, setReviewToRemove] = useState<{
    vendorId: string;
    reviewId: string;
    author: string;
    comment: string;
    vendorName: string;
  } | null>(null);
  const [adminRemovalReason, setAdminRemovalReason] = useState('Vendor dispute verified: Review contains factually false statements.');

  // Moderation state
  const [rejectReasonMap, setRejectReasonMap] = useState<Record<string, string>>({});

  // Local fallback state if props not passed
  const [localChargingActive, setLocalChargingActive] = useState(false);
  const [localGlobalTrialMonths, setLocalGlobalTrialMonths] = useState(6);
  const isCharging = isPlatformChargingActive !== undefined ? isPlatformChargingActive : localChargingActive;
  const currentTrialMonths = globalTrialMonths !== undefined ? globalTrialMonths : localGlobalTrialMonths;

  // Plan editing state
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editingPlanName, setEditingPlanName] = useState<string>('');
  const [editingMonthlyPrice, setEditingMonthlyPrice] = useState<number>(0);
  const [editingYearlyPrice, setEditingYearlyPrice] = useState<number>(0);
  const [editingLimit, setEditingLimit] = useState<string>('15');
  const [editingTrialMonths, setEditingTrialMonths] = useState<number>(6);
  const [editingFeatures, setEditingFeatures] = useState<string>('');
  const [editingBadgeText, setEditingBadgeText] = useState<string>('');

  // Create plan modal state
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [newPlanName, setNewPlanName] = useState('Platinum VIP Executive');
  const [newPlanTarget, setNewPlanTarget] = useState<'matrimony' | 'vendor'>('matrimony');
  const [newPlanMonthly, setNewPlanMonthly] = useState(15000);
  const [newPlanYearly, setNewPlanYearly] = useState(120000);
  const [newPlanLimit, setNewPlanLimit] = useState('unlimited');
  const [newPlanTrialMonths, setNewPlanTrialMonths] = useState(6);
  const [newPlanFeatures, setNewPlanFeatures] = useState('6 Months Free Launch Access, Dedicated Wali Facilitator, Verified Badge, Priority Placement');
  const [newPlanBadge, setNewPlanBadge] = useState('Exclusive');

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // User search
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Vendor search & category filter
  const [vendorSearchQuery, setVendorSearchQuery] = useState('');
  const [vendorCategoryFilter, setVendorCategoryFilter] = useState('all');

  // Activity filter
  const [activityCategoryFilter, setActivityCategoryFilter] = useState<string>('all');

  // Revenue analytics calculations (in LKR)
  const totalMatrimonySubscribers = profiles.filter((p) => p.tier !== 'free').length;
  const totalVendorSubscribers = vendors.filter((v) => v.subscriptionStatus === 'subscribed').length;
  const trialVendorsCount = vendors.filter((v) => v.subscriptionStatus === 'trial_active').length;

  const estimatedMatrimonyMRR = 3500 * 24 + 6500 * 18 + 12000 * 8; // Simulated MRR in LKR: ~297,000 LKR
  const estimatedVendorMRR = 5000 * 12 + 11000 * 6; // ~126,000 LKR
  const totalMRR = isCharging ? estimatedMatrimonyMRR + estimatedVendorMRR : 0;
  const totalLifetimeRevenue = 3840000; // LKR ~3.84 Million

  const pendingModerationItems = moderationQueue.filter((i) => i.status === 'pending');

  const startEditPlan = (plan: SubscriptionPlanConfig) => {
    setEditingPlanId(plan.id);
    setEditingPlanName(plan.name);
    setEditingMonthlyPrice(plan.priceMonthlyLKR);
    setEditingYearlyPrice(plan.priceYearlyLKR);
    setEditingLimit(plan.requestLimit.toString());
    setEditingTrialMonths(plan.freeTrialMonths || 6);
    setEditingFeatures(plan.features.join(', '));
    setEditingBadgeText(plan.badgeText || '');
  };

  const saveEditPlan = (plan: SubscriptionPlanConfig) => {
    onUpdatePlan({
      ...plan,
      name: editingPlanName || plan.name,
      priceMonthlyLKR: Number(editingMonthlyPrice),
      priceYearlyLKR: Number(editingYearlyPrice),
      requestLimit: editingLimit === 'unlimited' ? 'unlimited' : Number(editingLimit),
      freeTrialMonths: Number(editingTrialMonths),
      features: editingFeatures ? editingFeatures.split(',').map((f) => f.trim()).filter(Boolean) : plan.features,
      badgeText: editingBadgeText || undefined
    });
    setEditingPlanId(null);
    showToast(`Updated tier "${editingPlanName || plan.name}" successfully!`);
  };

  const handleTogglePlanActive = (plan: SubscriptionPlanConfig) => {
    onUpdatePlan({
      ...plan,
      isActive: !plan.isActive
    });
    showToast(`Tier "${plan.name}" is now ${!plan.isActive ? 'Active' : 'Disabled'}.`);
  };

  const handleToggleChargingSwitch = () => {
    if (onTogglePlatformCharging) {
      onTogglePlatformCharging();
    } else {
      setLocalChargingActive((prev) => !prev);
    }
    showToast(!isCharging ? 'Platform Subscription Charges Enabled.' : 'Switched to 100% Free Promotional Launch Mode (0 LKR).');
  };

  const handleSetTrialMonths = (m: number) => {
    if (onUpdateGlobalTrialMonths) {
      onUpdateGlobalTrialMonths(m);
    } else {
      setLocalGlobalTrialMonths(m);
    }
    showToast(`Platform Free Trial updated to ${m} Months (${m * 30} Days)!`);
  };

  const handleGrantAllVendorsTrial = () => {
    if (onGrantAllVendorsTrialDays) {
      onGrantAllVendorsTrialDays(180);
    }
    showToast('Granted 6 Months (180 Days) Free Trial to all registered wedding vendors!');
  };

  const handleCreatePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanName.trim()) return;

    const newTier: SubscriptionPlanConfig = {
      id: `sub_${Date.now()}`,
      code: newPlanName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      name: newPlanName,
      targetType: newPlanTarget,
      priceMonthlyLKR: Number(newPlanMonthly),
      priceYearlyLKR: Number(newPlanYearly),
      requestLimit: newPlanLimit === 'unlimited' ? 'unlimited' : Number(newPlanLimit),
      freeTrialMonths: Number(newPlanTrialMonths),
      features: newPlanFeatures.split(',').map((f) => f.trim()).filter(Boolean),
      isActive: true,
      badgeText: newPlanBadge || undefined
    };

    if (onCreatePlan) {
      onCreatePlan(newTier);
    } else {
      onUpdatePlan(newTier);
    }

    setShowCreatePlanModal(false);
    showToast(`Created new tier "${newPlanName}" successfully!`);
  };

  const filteredLogs = activityLogs.filter((log) => {
    if (activityCategoryFilter !== 'all' && log.category !== activityCategoryFilter) return false;
    return true;
  });

  const filteredUsers = profiles.filter((p) => {
    if (!userSearchQuery.trim()) return true;
    const q = userSearchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.district.toLowerCase().includes(q) || p.occupation.toLowerCase().includes(q);
  });

  const filteredAdminVendors = vendors.filter((v) => {
    if (vendorCategoryFilter !== 'all' && v.category !== vendorCategoryFilter) return false;
    if (vendorSearchQuery.trim()) {
      const q = vendorSearchQuery.toLowerCase();
      return (
        v.businessName.toLowerCase().includes(q) ||
        v.name.toLowerCase().includes(q) ||
        v.district.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Toast alert feedback banner */}
      {toastMessage && (
        <div className="sticky top-4 z-50 p-4 rounded-2xl bg-emerald-600 text-white font-semibold text-xs shadow-xl flex items-center justify-between gap-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="p-1 hover:bg-emerald-700 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Enterprise Portal Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-amber-500/20 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase">
              Nikahtent Administration & Compliance
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white font-['Plus_Jakarta_Sans']">
            Admin Web Portal & Revenue Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise dashboard for photo moderation approvals, dynamic subscription plans, financial analytics, wedding vendor oversight, and user activity audit trails.
          </p>
        </div>

        {/* Pending approvals badge */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs">
            <span className="text-slate-400 block text-[10px]">Photo Moderation</span>
            <span className="font-bold text-amber-400 tabular-nums">
              {pendingModerationItems.length} Pending Approval
            </span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs">
            <span className="text-slate-400 block text-[10px]">Active Vendors</span>
            <span className="font-bold text-emerald-400 tabular-nums">
              {vendors.length} ({trialVendorsCount} in 6-Mo Free Trial)
            </span>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'analytics', label: 'Revenue & Analytics', icon: TrendingUp },
          { id: 'moderation', label: `Image Approvals (${pendingModerationItems.length})`, icon: FileCheck },
          { id: 'plans', label: 'Plan & 6-Mo Free Setup', icon: Sliders },
          { id: 'users', label: 'User Directory & NIC Verification', icon: Users },
          { id: 'vendors', label: `Vendors, Halls & Cars (${vendors.length})`, icon: Store },
          { id: 'activity', label: 'System Activities & Audit Log', icon: Activity }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all whitespace-nowrap border-b-2 ${
                isSelected
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: REVENUE DETAILS & ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Key Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                Total Platform Revenue
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xs text-slate-500">LKR</span>
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                  {totalLifetimeRevenue.toLocaleString()}
                </span>
              </div>
              <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5 mt-1">
                <ArrowUpRight className="w-3 h-3" />
                <span>+24.8% from previous quarter</span>
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                Monthly Recurring Revenue (MRR)
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xs text-slate-500">LKR</span>
                <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {totalMRR.toLocaleString()}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                Matrimony: LKR {estimatedMatrimonyMRR.toLocaleString()} · Vendor: LKR {estimatedVendorMRR.toLocaleString()}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                Active Matrimony Members
              </span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums mt-1">
                1,420
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                {totalMatrimonySubscribers} active paying tier members
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                Vendor 2-Mo Free Trial Conversions
              </span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums mt-1">
                78.4%
              </div>
              <span className="text-[10px] text-amber-600 font-medium block mt-1">
                {trialVendorsCount} currently in 60-day trial
              </span>
            </div>
          </div>

          {/* Revenue Breakdown by Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Revenue Source Breakdown (LKR)
              </h3>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-600 dark:text-slate-400">Matrimonial Premium Tiers (Silver / Gold / Platinum)</span>
                    <span className="text-slate-900 dark:text-white tabular-nums">70% (LKR 297,000/mo)</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full w-[70%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-600 dark:text-slate-400">Wedding Vendor Post-Trial Subscriptions</span>
                    <span className="text-slate-900 dark:text-white tabular-nums">30% (LKR 126,000/mo)</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full w-[30%]" />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 space-y-1">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Monetization Strategy:
                </p>
                <p>
                  1. Free tier users receive 3 monthly requests. Heavy users convert to Silver/Gold for unlimited requests.
                </p>
                <p>
                  2. Wedding vendors receive 2 months completely free before converting to LKR 5,000 or LKR 11,000 monthly visibility tiers.
                </p>
              </div>
            </div>

            {/* Popular District Matrimonial Density */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Member Distribution by Sri Lankan District
              </h3>

              <div className="space-y-2.5 text-xs">
                {[
                  { name: 'Colombo (Wellawatte, Dehiwala, Colpetty)', count: '640 Members', pct: '45%' },
                  { name: 'Kandy (Akurana, Katugastota, City)', count: '320 Members', pct: '22%' },
                  { name: 'Galle & Southern Province', count: '180 Members', pct: '13%' },
                  { name: 'Eastern Province (Ampara, Batticaloa, Kalmunai)', count: '170 Members', pct: '12%' },
                  { name: 'Kurunegala, Matale & Other Districts', count: '110 Members', pct: '8%' }
                ].map((d, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{d.name}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{d.count} ({d.pct})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: IMAGE APPROVAL & SECURITY MODERATION QUEUE */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-sm block">
                Two-Stage Moderation Protocol
              </span>
              <p className="mt-0.5 text-amber-800 dark:text-amber-300 leading-relaxed">
                Step 1: Automated client compression & security heuristic scan checks for payloads and modesty patterns.
                Step 2: Manual admin check verifies photo authenticity before publication. When approved or rejected, an automated push notification is dispatched to the user.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {moderationQueue.map((item) => {
              const isPending = item.status === 'pending';
              const currentReason = rejectReasonMap[item.id] || 'Non-human or inappropriate graphic';

              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isPending
                      ? 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-900/60 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-80'
                  }`}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Image Preview */}
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                        <img
                          src={item.imageUrl}
                          alt="Moderation candidate"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                            {item.userName}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              item.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : item.status === 'rejected'
                                ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500">
                          File: <span className="font-mono text-slate-700 dark:text-slate-300">{item.originalFileName}</span> · Uploaded {item.uploadedAt}
                        </p>

                        {/* Compression stats */}
                        <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                          <span>Original: <strong>{item.originalSizeKb} KB</strong></span>
                          <span>→</span>
                          <span>Compressed: <strong className="text-emerald-600">{item.compressedSizeKb} KB</strong></span>
                          <span className="text-emerald-600 font-bold">({item.compressionRatio})</span>
                        </div>

                        {/* Scan details */}
                        <div className="text-[11px] flex items-center gap-1.5 pt-0.5">
                          <span className="font-semibold text-slate-500">Scan Status:</span>
                          <span className={item.scanResult === 'clean' ? 'text-emerald-600 font-bold' : 'text-red-600 font-bold'}>
                            {item.scanResult.toUpperCase()}
                          </span>
                          <span className="text-slate-400">· {item.scanDetails}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {isPending ? (
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 w-full md:w-auto">
                        <select
                          value={currentReason}
                          onChange={(e) =>
                            setRejectReasonMap({
                              ...rejectReasonMap,
                              [item.id]: e.target.value
                            })
                          }
                          className="text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
                        >
                          <option value="Non-human or inappropriate graphic">Non-human or cartoon avatar</option>
                          <option value="Low resolution or obscured facial features">Low resolution / obscured face</option>
                          <option value="Modesty policy non-compliance">Modesty policy non-compliance</option>
                        </select>

                        <div className="flex gap-2">
                          <button
                            onClick={() => onRejectImage(item.id, currentReason)}
                            className="px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 dark:bg-red-950/40 rounded-xl"
                          >
                            Reject & Alert User
                          </button>

                          <button
                            onClick={() => onApproveImage(item.id)}
                            className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Approve & Publish</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic">
                        {item.status === 'approved' ? 'Published live to member profile' : `Rejected: ${item.rejectionReason}`}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: DYNAMIC SUBSCRIPTION PLAN CONFIGURATOR & 6-MONTH FREE TRIAL SETUP */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          {/* Master 6-Month Free Launch Switchboard Banner */}
          <div className={`rounded-3xl p-6 sm:p-7 border transition-all ${
            !isCharging 
              ? 'bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white border-emerald-700/60 shadow-xl'
              : 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white border-indigo-700/60 shadow-xl'
          }`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    !isCharging ? 'bg-amber-400 text-slate-950' : 'bg-indigo-500 text-white'
                  }`}>
                    <Gift className="w-3.5 h-3.5" />
                    {!isCharging ? '6-Month Free Launch Promotion Active' : 'Paid Subscription Billing Enforced'}
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    Default Free Trial: {currentTrialMonths} Months ({currentTrialMonths * 30} Days)
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans']">
                  {!isCharging 
                    ? '🎉 100% Free Promotional Launch Mode (0 LKR Fee)' 
                    : '💳 Platform Subscription Charges Active'}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  {!isCharging 
                    ? 'All Muslim matrimonial seekers and wedding service vendors (wedding halls, car rentals, beauticians, caterers, photographers) have completely free visibility and unlimited connection privileges. No paywall is enforced during this 6-month launch phase.'
                    : 'Subscription charges are active. Members and vendors pay regular monthly/yearly fees once their 6-month free trial period expires.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <button
                  onClick={handleToggleChargingSwitch}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 ${
                    !isCharging
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  }`}
                >
                  {!isCharging ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  <span>{!isCharging ? 'Enable Paid Subscriptions' : 'Switch to 100% Free Mode'}</span>
                </button>

                <button
                  onClick={handleGrantAllVendorsTrial}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Grant +180d Free to ALL Vendors</span>
                </button>
              </div>
            </div>

            {/* Trial Duration Selector Buttons */}
            <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-300 font-semibold mr-1">Configure Platform Trial Duration:</span>
              {[3, 6, 9, 12].map((m) => (
                <button
                  key={m}
                  onClick={() => handleSetTrialMonths(m)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    currentTrialMonths === m
                      ? 'bg-amber-400 text-slate-950 ring-2 ring-white/50'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {m} Months ({m * 30} Days) {m === 6 ? '⭐ Launch Default' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Section Heading & Create Tier Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Matrimony & Vendor Subscription Tiers
              </h3>
              <p className="text-xs text-slate-500">
                Setup and edit monthly/yearly pricing, free trial duration, request quotas, and perks for every tier in real time.
              </p>
            </div>

            <button
              onClick={() => setShowCreatePlanModal(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Create New Custom Tier</span>
            </button>
          </div>

          {/* Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => {
              const isEditing = editingPlanId === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`p-5 rounded-2xl border shadow-xs flex flex-col justify-between transition-all ${
                    !plan.isActive 
                      ? 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {plan.targetType === 'matrimony' ? 'Matrimonial Tier' : 'Vendor Listing Tier'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {plan.badgeText && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400">
                            {plan.badgeText}
                          </span>
                        )}
                        <span className={`w-2 h-2 rounded-full ${plan.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="space-y-3 my-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">
                            Tier Name:
                          </label>
                          <input
                            type="text"
                            value={editingPlanName}
                            onChange={(e) => setEditingPlanName(e.target.value)}
                            className="w-full p-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-1">
                              Monthly Price (LKR):
                            </label>
                            <input
                              type="number"
                              value={editingMonthlyPrice}
                              onChange={(e) => setEditingMonthlyPrice(Number(e.target.value))}
                              className="w-full p-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-1">
                              Yearly Price (LKR):
                            </label>
                            <input
                              type="number"
                              value={editingYearlyPrice}
                              onChange={(e) => setEditingYearlyPrice(Number(e.target.value))}
                              className="w-full p-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-1">
                              Free Trial (Months):
                            </label>
                            <input
                              type="number"
                              value={editingTrialMonths}
                              onChange={(e) => setEditingTrialMonths(Number(e.target.value))}
                              className="w-full p-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-1">
                              Request Limit:
                            </label>
                            <input
                              type="text"
                              value={editingLimit}
                              onChange={(e) => setEditingLimit(e.target.value)}
                              placeholder="number or 'unlimited'"
                              className="w-full p-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">
                            Badge Text (Optional):
                          </label>
                          <input
                            type="text"
                            value={editingBadgeText}
                            onChange={(e) => setEditingBadgeText(e.target.value)}
                            placeholder="e.g. Popular, VIP, Launch Special"
                            className="w-full p-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">
                            Features (Comma separated):
                          </label>
                          <textarea
                            value={editingFeatures}
                            onChange={(e) => setEditingFeatures(e.target.value)}
                            rows={2}
                            className="w-full p-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white">
                          {plan.name}
                        </h4>

                        <div className="my-3">
                          <div className="flex items-baseline gap-1">
                            <span className="text-xs text-slate-400">LKR</span>
                            <span className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                              {plan.priceMonthlyLKR.toLocaleString()}
                            </span>
                            <span className="text-xs text-slate-400">/ mo</span>
                          </div>

                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                              🎁 {plan.freeTrialMonths || 6} Months Free
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Yearly: LKR {plan.priceYearlyLKR.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 mb-4">
                          {plan.features.map((f, fi) => (
                            <li key={fi} className="flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => handleTogglePlanActive(plan)}
                      className={`text-xs font-semibold ${
                        plan.isActive ? 'text-slate-400 hover:text-slate-600' : 'text-emerald-600 hover:text-emerald-700'
                      }`}
                    >
                      {plan.isActive ? 'Disable Tier' : 'Enable Tier'}
                    </button>

                    {isEditing ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingPlanId(null)}
                          className="px-3 py-1.5 text-xs font-medium text-slate-500 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveEditPlan(plan)}
                          className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg flex items-center gap-1"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditPlan(plan)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Pricing & Quota</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal to Create New Custom Tier */}
          {showCreatePlanModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
              <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-emerald-600" />
                    <span>Create Custom Subscription Tier</span>
                  </h3>
                  <button
                    onClick={() => setShowCreatePlanModal(false)}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreatePlanSubmit} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Tier Name:
                    </label>
                    <input
                      type="text"
                      required
                      value={newPlanName}
                      onChange={(e) => setNewPlanName(e.target.value)}
                      placeholder="e.g. Royal Diamond Tier"
                      className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Target Audience:
                      </label>
                      <select
                        value={newPlanTarget}
                        onChange={(e) => setNewPlanTarget(e.target.value as any)}
                        className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                      >
                        <option value="matrimony">Matrimonial Members</option>
                        <option value="vendor">Wedding Vendors</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Free Trial (Months):
                      </label>
                      <input
                        type="number"
                        value={newPlanTrialMonths}
                        onChange={(e) => setNewPlanTrialMonths(Number(e.target.value))}
                        className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Monthly Price (LKR):
                      </label>
                      <input
                        type="number"
                        required
                        value={newPlanMonthly}
                        onChange={(e) => setNewPlanMonthly(Number(e.target.value))}
                        className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Yearly Price (LKR):
                      </label>
                      <input
                        type="number"
                        required
                        value={newPlanYearly}
                        onChange={(e) => setNewPlanYearly(Number(e.target.value))}
                        className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Monthly Request Quota:
                      </label>
                      <input
                        type="text"
                        value={newPlanLimit}
                        onChange={(e) => setNewPlanLimit(e.target.value)}
                        placeholder="e.g. 50 or 'unlimited'"
                        className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Highlight Badge:
                      </label>
                      <input
                        type="text"
                        value={newPlanBadge}
                        onChange={(e) => setNewPlanBadge(e.target.value)}
                        placeholder="e.g. VIP, Launch Special"
                        className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Features (Comma separated):
                    </label>
                    <textarea
                      value={newPlanFeatures}
                      onChange={(e) => setNewPlanFeatures(e.target.value)}
                      rows={3}
                      placeholder="6 Months Free Launch Access, Dedicated Matchmaker, Verified Badge"
                      className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCreatePlanModal(false)}
                      className="px-4 py-2 text-xs font-medium text-slate-500 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md"
                    >
                      Create Tier
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: USER DIRECTORY & NIC IDENTITY VERIFICATION */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <input
              type="text"
              placeholder="Search user name, occupation, district..."
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              className="w-full sm:w-80 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
            />
            <span className="text-xs text-slate-400">
              Showing {filteredUsers.length} Registered Accounts
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">User & District</th>
                    <th className="p-3">Registered By</th>
                    <th className="p-3">Tier</th>
                    <th className="p-3">NIC Verification</th>
                    <th className="p-3">Photo Approval</th>
                    <th className="p-3 text-right">Moderator Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={user.photoUrl}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {user.name}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {user.city}, {user.district} · {user.occupation}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3 font-medium text-slate-600 dark:text-slate-300">
                        {user.registeredBy.toUpperCase()}
                      </td>

                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {user.tier}
                        </span>
                      </td>

                      <td className="p-3">
                        <button
                          onClick={() => onToggleUserVerification(user.id)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors ${
                            user.idVerified
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>{user.idVerified ? 'NIC Verified' : 'Unverified'}</span>
                        </button>
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            user.approvalStatus === 'approved'
                              ? 'text-emerald-600'
                              : user.approvalStatus === 'rejected'
                              ? 'text-red-500'
                              : 'text-amber-500'
                          }`}
                        >
                          {user.approvalStatus}
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        <button
                          onClick={() => onToggleUserBan(user.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            user.isBlocked
                              ? 'bg-red-600 text-white'
                              : 'text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40'
                          }`}
                        >
                          {user.isBlocked ? 'Account Suspended' : 'Suspend / Ban'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: WEDDING VENDORS & CAR HIRE OVERSIGHT */}
      {activeTab === 'vendors' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search vendor, car hire, district..."
                value={vendorSearchQuery}
                onChange={(e) => setVendorSearchQuery(e.target.value)}
                className="w-full sm:w-72 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
              />
              <select
                value={vendorCategoryFilter}
                onChange={(e) => setVendorCategoryFilter(e.target.value)}
                className="text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
              >
                <option value="all">All Vendor Categories</option>
                <option value="wedding_hall">Wedding Halls & Venues</option>
                <option value="car_rental">Car Rental & Bridal Hire</option>
                <option value="beautician">Bridal Beauticians</option>
                <option value="catering">Walima Catering</option>
                <option value="stage_decor">Stage Decor & Sofas</option>
                <option value="tent_chairs">Tents & Chairs</option>
                <option value="photo_shooter">Photography</option>
                <option value="chef">Master Chefs</option>
              </select>
            </div>

            <span className="text-xs text-slate-400">
              Showing {filteredAdminVendors.length} Registered Wedding Vendors
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Vendor / Service</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">District</th>
                    <th className="p-3">2-Month Free Trial Status</th>
                    <th className="p-3">Verified Badge</th>
                    <th className="p-3">Starting Rate</th>
                    <th className="p-3">Reviews & Rating</th>
                    <th className="p-3 text-right">Contact / Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredAdminVendors.map((vendor) => {
                    const img = vendor.portfolioImages[0] || '/src/assets/images/hero_sri_lanka_nikah_1790449981525.jpg';
                    const isCar = vendor.category === 'car_rental';
                    const isHall = vendor.category === 'wedding_hall';

                    return (
                      <tr key={vendor.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={img}
                              alt=""
                              className="w-10 h-8 rounded-lg object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white block">
                                {vendor.businessName}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                {vendor.name} · {vendor.packages.length} Packages listed
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 w-fit ${
                            isHall
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                              : isCar 
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}>
                            {isHall && <Building2 className="w-3 h-3" />}
                            {isCar && <Car className="w-3 h-3" />}
                            <span>{vendor.category.replace('_', ' ')}</span>
                          </span>
                        </td>

                        <td className="p-3 text-slate-600 dark:text-slate-300">
                          {vendor.district}
                        </td>

                        <td className="p-3">
                          {vendor.subscriptionStatus === 'trial_active' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                              {vendor.trialDaysLeft} Days Left (2-Mo Trial)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                              Subscribed
                            </span>
                          )}
                        </td>

                        <td className="p-3">
                          <button
                            onClick={() => onToggleVendorVerified(vendor.id)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors ${
                              vendor.isVerified
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                            }`}
                          >
                            <ShieldCheck className="w-3 h-3" />
                            <span>{vendor.isVerified ? 'Verified' : 'Unverified'}</span>
                          </button>
                        </td>

                        <td className="p-3 font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                          LKR {vendor.startingPriceLKR.toLocaleString()}
                          <span className="text-[10px] text-slate-400 font-normal block">
                            {vendor.priceUnit}
                          </span>
                        </td>

                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-amber-500">★ {vendor.rating.toFixed(1)}</span>
                            <span className="text-[10px] text-slate-400">({vendor.reviewCount})</span>
                          </div>
                        </td>

                        <td className="p-3 text-right">
                          <a
                            href={`https://wa.me/${vendor.whatsapp}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-lg inline-block"
                          >
                            WhatsApp
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SYSTEM ACTIVITIES & AUDIT LOG */}
      {activeTab === 'activity' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Live System Activities & Compliance Audit Log
            </h3>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Filter:</span>
              <select
                value={activityCategoryFilter}
                onChange={(e) => setActivityCategoryFilter(e.target.value)}
                className="text-xs p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
              >
                <option value="all">All Events</option>
                <option value="request">Connection Requests</option>
                <option value="subscription">Subscriptions</option>
                <option value="booking">Vendor Bookings</option>
                <option value="moderation">Moderation & Verification</option>
              </select>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 shadow-xs">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {log.action}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase font-semibold">
                        {log.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      {log.details}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Actor: <strong>{log.userName}</strong> ({log.ipOrLocation})
                    </span>
                  </div>
                </div>

                <span className="text-[11px] text-slate-400 shrink-0 tabular-nums">
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
