import React, { useState } from 'react';
import { X, Check, Sparkles, Crown, Zap, ShieldCheck } from 'lucide-react';
import { UserTier, SubscriptionPlanConfig } from '../types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: UserTier;
  plans: SubscriptionPlanConfig[];
  onSelectTier: (tier: UserTier) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentTier,
  plans,
  onSelectTier
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  if (!isOpen) return null;

  const matrimonyPlans = plans.filter((p) => p.targetType === 'matrimony');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                <Crown className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Nikahtent Premium Membership Tiers
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Every member receives 3 free requests/month. Upgrade to Silver, Gold, or Platinum for unlimited profile requests and priority Chaperone access.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Billing Toggle */}
        <div className="pt-6 pb-2 px-6 flex justify-center">
          <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 ${
                billingCycle === 'yearly'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Yearly (Save 30%)</span>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-full font-bold">
                Mubarak Deal
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {matrimonyPlans.filter((p) => p.code !== 'free').map((plan) => {
            const isCurrent = currentTier === plan.code;
            const isPlatinum = plan.code === 'platinum';
            const price = billingCycle === 'monthly' ? plan.priceMonthlyLKR : Math.round(plan.priceYearlyLKR / 12);

            return (
              <div
                key={plan.id}
                className={`relative rounded-xl border p-5 flex flex-col justify-between transition-all ${
                  isPlatinum
                    ? 'border-amber-400/80 bg-gradient-to-b from-amber-500/5 to-transparent dark:from-amber-950/20 shadow-lg shadow-amber-500/5 ring-1 ring-amber-400/40'
                    : isCurrent
                    ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 ring-1 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                {plan.badgeText && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wider shadow-sm">
                      {plan.badgeText}
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {plan.name}
                    </h3>
                    {isPlatinum ? (
                      <Crown className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Zap className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>

                  <div className="mt-4 mb-5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-slate-500 font-medium">LKR</span>
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                        {price.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500">/ month</span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                        Billed as LKR {plan.priceYearlyLKR.toLocaleString()} annually
                      </p>
                    )}
                  </div>

                  <div className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {plan.requestLimit === 'unlimited'
                        ? 'Unlimited profile requests'
                        : `${plan.requestLimit} connection requests / month`}
                    </span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 mb-6">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    onSelectTier(plan.code as UserTier);
                    onClose();
                  }}
                  disabled={isCurrent}
                  className={`w-full py-2.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                    isCurrent
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      : isPlatinum
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  }`}
                >
                  {isCurrent ? 'Current Plan' : `Upgrade to ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>

        {/* Trust Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            All payments simulated in Sri Lankan Rupees (LKR). Commercial Gateways supported: PayHere Sri Lanka, Genie, Commercial Bank IPG.
          </p>
        </div>
      </div>
    </div>
  );
};
