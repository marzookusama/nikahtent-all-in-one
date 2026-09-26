import React, { useState } from 'react';
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
  Filter
} from 'lucide-react';
import { 
  ImageModerationItem, 
  SubscriptionPlanConfig, 
  UserActivityLog, 
  UserProfile, 
  VendorListing 
} from '../types';

interface AdminPortalProps {
  moderationQueue: ImageModerationItem[];
  onApproveImage: (itemId: string) => void;
  onRejectImage: (itemId: string, reason: string) => void;
  subscriptionPlans: SubscriptionPlanConfig[];
  onUpdatePlan: (updatedPlan: SubscriptionPlanConfig) => void;
  activityLogs: UserActivityLog[];
  profiles: UserProfile[];
  onToggleUserVerification: (userId: string) => void;
  onToggleUserBan: (userId: string) => void;
  vendors: VendorListing[];
  onToggleVendorVerified: (vendorId: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  moderationQueue,
  onApproveImage,
  onRejectImage,
  subscriptionPlans,
  onUpdatePlan,
  activityLogs,
  profiles,
  onToggleUserVerification,
  onToggleUserBan,
  vendors,
  onToggleVendorVerified
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'moderation' | 'plans' | 'users' | 'activity'>('analytics');

  // Moderation state
  const [rejectReasonMap, setRejectReasonMap] = useState<Record<string, string>>({});

  // Plan editing state
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editingMonthlyPrice, setEditingMonthlyPrice] = useState<number>(0);
  const [editingYearlyPrice, setEditingYearlyPrice] = useState<number>(0);
  const [editingLimit, setEditingLimit] = useState<string>('15');

  // User search
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Activity filter
  const [activityCategoryFilter, setActivityCategoryFilter] = useState<string>('all');

  // Revenue analytics calculations (in LKR)
  const totalMatrimonySubscribers = profiles.filter((p) => p.tier !== 'free').length;
  const totalVendorSubscribers = vendors.filter((v) => v.subscriptionStatus === 'subscribed').length;
  const trialVendorsCount = vendors.filter((v) => v.subscriptionStatus === 'trial_active').length;

  const estimatedMatrimonyMRR = 3500 * 24 + 6500 * 18 + 12000 * 8; // Simulated MRR in LKR: ~297,000 LKR
  const estimatedVendorMRR = 5000 * 12 + 11000 * 6; // ~126,000 LKR
  const totalMRR = estimatedMatrimonyMRR + estimatedVendorMRR;
  const totalLifetimeRevenue = 3840000; // LKR ~3.84 Million

  const pendingModerationItems = moderationQueue.filter((i) => i.status === 'pending');

  const startEditPlan = (plan: SubscriptionPlanConfig) => {
    setEditingPlanId(plan.id);
    setEditingMonthlyPrice(plan.priceMonthlyLKR);
    setEditingYearlyPrice(plan.priceYearlyLKR);
    setEditingLimit(plan.requestLimit.toString());
  };

  const saveEditPlan = (plan: SubscriptionPlanConfig) => {
    onUpdatePlan({
      ...plan,
      priceMonthlyLKR: Number(editingMonthlyPrice),
      priceYearlyLKR: Number(editingYearlyPrice),
      requestLimit: editingLimit === 'unlimited' ? 'unlimited' : Number(editingLimit)
    });
    setEditingPlanId(null);
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

  return (
    <div className="space-y-6 pb-20">
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
            Enterprise dashboard for photo moderation approvals, dynamic subscription plans, financial analytics, and user activity audit trails.
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
              {vendors.length} ({trialVendorsCount} in 2-Mo Trial)
            </span>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'analytics', label: 'Revenue & Analytics', icon: TrendingUp },
          { id: 'moderation', label: `Image Approvals (${pendingModerationItems.length})`, icon: FileCheck },
          { id: 'plans', label: 'Subscription Plan Config', icon: Sliders },
          { id: 'users', label: 'User Directory & NIC Verification', icon: Users },
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

      {/* TAB 3: DYNAMIC SUBSCRIPTION PLAN CONFIGURATOR */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Subscription Plan Pricing & Quota Management
              </h3>
              <p className="text-xs text-slate-500">
                Update Sri Lankan Rupee pricing, yearly discounts, and connection request limits for matrimonial and wedding vendor tiers in real time.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => {
              const isEditing = editingPlanId === plan.id;

              return (
                <div
                  key={plan.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {plan.targetType === 'matrimony' ? 'Matrimonial Tier' : 'Vendor Listing Tier'}
                      </span>
                      {plan.badgeText && (
                        <span className="text-[10px] font-bold text-amber-500">
                          {plan.badgeText}
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-base text-slate-900 dark:text-white">
                      {plan.name}
                    </h4>

                    {isEditing ? (
                      <div className="space-y-3 my-4">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-500 block mb-1">
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
                          <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                            Yearly Price (LKR):
                          </label>
                          <input
                            type="number"
                            value={editingYearlyPrice}
                            onChange={(e) => setEditingYearlyPrice(Number(e.target.value))}
                            className="w-full p-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                            Monthly Request Limit:
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
                    ) : (
                      <div className="my-4">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs text-slate-400">LKR</span>
                          <span className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                            {plan.priceMonthlyLKR.toLocaleString()}
                          </span>
                          <span className="text-xs text-slate-400">/ mo</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Yearly: LKR {plan.priceYearlyLKR.toLocaleString()} · Quota: {plan.requestLimit} requests
                        </p>
                      </div>
                    )}

                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 mb-4">
                      {plan.features.map((f, fi) => (
                        <li key={fi} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
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
                        <span>Edit Pricing</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
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

      {/* TAB 5: SYSTEM ACTIVITIES & AUDIT LOG */}
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
