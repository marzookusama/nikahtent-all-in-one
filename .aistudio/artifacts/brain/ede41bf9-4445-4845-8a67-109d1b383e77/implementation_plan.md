# Nikahtent: Sri Lankan Muslim Matrimony & Wedding Hub

An integrated, mobile-first iOS and Android web application for the Sri Lankan Muslim community, paired with an enterprise-grade Admin Web Portal. Nikahtent combines high-trust matrimonial matchmaking with personality compatibility algorithms, a full-service wedding vendor marketplace (wedding photographers/cinematographers, bridal beauticians, catering, private chefs, stage decor, chairs, and tents), vendor monetization (2 months free trial followed by subscription plans), and a comprehensive Admin Web Portal with financial revenue analytics, dynamic subscription plan configurator, user activity audit logs, and unified moderation queues.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and UX choices have been confirmed and incorporated:

- **Brand & Identity**: **Nikahtent** — honoring both the sacred Nikah (matrimonial covenant) and the wedding event infrastructure (tents, stages, photography, and walima celebrations) with Sri Lankan cultural resonance (Colombo, Kandy, Galle, Batticaloa, Trincomalee, Kurunegala, etc.).
- **Dual Navigation Hub**: Seamless top/bottom navigation allowing members to toggle effortlessly between **Matrimony** (matchmaking, requests, chats, wali registration) and **Wedding Services** (photography, beauticians, stage/tent rentals, catering, chef bookings, ratings & reviews).
- **Dedicated Admin Web Portal**:
  - Designed as an expansive, modern web command center with full-screen desktop optimization.
  - **Revenue & Financial Analytics**: Real-time Gross Revenue (LKR), Monthly Recurring Revenue (MRR), subscription renewals, conversion rate from 2-month free trial to paid vendor plans, and visual earnings breakdown.
  - **Subscription Plan Configurator**: Dynamic settings panel to customize pricing (LKR), features, duration, and quotas for both Member Tiers (Silver, Gold, Platinum) and Vendor Listing Tiers (Standard, Featured Pro, Elite), plus free trial duration settings.
  - **User Activities & Security Audit Stream**: Real-time chronological audit trail of all platform activities (signups, requests sent/accepted/declined, reported accounts, blocked users, vendor bookings).
  - **Unified Approvals Center**: Profile photo inspection & scan diagnostics, member NIC/ID verification, and vendor business verification with direct Approve/Reject triggers and automated user notifications.
- **Vendor Self-Service Portal & 2-Month Free Trial**:
  - Independent vendor onboarding for Photographers, Beauticians, Caterers, Chefs, and Stage/Tent providers.
  - 60-day (2-month) free trial countdown with subscription renewal simulator.
- **Interactive Multi-Role Switcher**: Persistent selector allowing instant switching between:
  1. **Member / User (Mobile App View)**: Browse matches, manage privacy, Wali/Self profile builder, send up to 3 free monthly requests or test Silver/Gold/Platinum tiers, accept/decline with silent rejection, book wedding vendors.
  2. **Vendor Portal**: Register new vendor profile, build packages/pricing, monitor 2-month trial status, simulate subscription renewal, manage client booking requests, and respond to reviews.
  3. **Admin Web Portal**: Revenue & analytics dashboard, subscription plan configurator, live user activity logs, photo/vendor/ID approvals, and platform settings.

---

## 1. Overview & Core Concept

### What It Does
Nikahtent provides a holistic matrimonial ecosystem tailored specifically to Sri Lankan Muslim cultural norms:
- **Matrimonial Matchmaking**:
  - Registration as **Self** or on behalf of family members (**Parent, Brother, Sister, Wali / Chaperone**).
  - Advanced compatibility scoring based on personality traits, religious practice, cultural values, education, and lifestyle.
  - Granular **photo privacy settings**: Public, Blurred / Protected until Request Accepted, or Locked with Watermark.
  - Quota system: **3 free connection requests per month**, with Silver, Gold, and Platinum tier upgrades for unlimited requests.
  - **Asymmetric Request Handling**: Recipient gets instant notification with Accept/Decline actions. On Accept, an encrypted chat channel opens. On Decline, the request is permanently and silently purged—the sender receives no negative rejection notification, preserving dignity and preventing platform harassment.
  - **Safety & Verification**: ID/NIC verification status, safety reporting, one-click blocking, and automated safety guidelines.
  - **AI & Admin Image Moderation Pipeline**: Automated client-side image compression and malicious/inappropriate content scan simulation upon photo upload. Photos enter a "Pending Admin Approval" state with live status notifications once an admin approves or rejects them.
  - **Simulated End-to-End Encrypted (E2EE) Chat**: Key exchange indicators and encrypted state badges for secure, private conversations between matched parties.
- **Wedding Vendor & Walima Marketplace**:
  - **Wedding Photographers & Videographers**: Studio & candid photo shooters, female crew options for female-only Nikah/Walima halls, drone coverage, photobook packages, and video reels.
  - **Bridal Beauty Parlors & Makeup Artists**: Portfolios, package pricing, booking calendars, and verified client ratings & reviews.
  - **Catering & Master Chefs**: Traditional Sri Lankan Muslim wedding menus (Dum Buriyani, Watalappam, Malay Pickle, Samosas, Faluda) and customized quotes.
  - **Wedding Stage Decor, Chairs & Marquee Tents**: Stage backdrops, floral setups, illuminated bridal sofas, banquet seating, canopy tents, and sound setup packages.
  - **Vendor Self-Registration & Monetization**: Direct onboarding, service catalog management, 60-day free trial counter, and subscription renewal to maintain app visibility.
- **Enterprise Admin Web Portal**:
  - Live revenue analytics, MRR tracker, and subscription tier distribution charts.
  - Dynamic pricing & plan editor (edit LKR prices, free request quotas, and trial durations).
  - Approvals workflow for profile pictures, vendor listings, and member ID badges.
  - Real-time audit log of all system events.

### Target Audience & Persona
- **Sri Lankan Muslim Brides, Grooms, and Walis/Families**: In Colombo, Kandy, Galle, Eastern Province, Central Hills, and the global Sri Lankan diaspora seeking halal, culturally aligned matrimonial matching with family dignity and photo security.
- **Couples & Families Planning Weddings**: Discovering and booking trusted, community-reviewed photographers, caterers, beauticians, and tent decorators.
- **Wedding Service Providers & Studios**: Photographers, salons, rental firms, and caterers leveraging the 2-month free trial to capture wedding leads across Sri Lanka.
- **Platform Administrators & Moderators**: Managing revenue, adjusting subscription plans, moderating media, and protecting user safety.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Onboarding & Profile Setup (Matrimony)**:
   - Select registration role ("Registering for Myself" vs "Registering for Son/Daughter/Sibling as Wali").
   - Complete personal, religious, educational, and personality interest traits (e.g., Islamic values, career ambition, family orientation, hobbies, languages: English, Tamil, Sinhala).
   - Upload profile photo: automatic client compression and automated safety scan trigger. Enters "Pending Moderation" state.
   - Configure photo privacy: "Blurred until Connection Accepted" or "Visible to Verified Members".
2. **Match Discovery & Compatibility Engine**:
   - Filter by location (District: Colombo, Gampaha, Kandy, Ampara, etc.), age range, profession, sect/tradition, and personality traits.
   - Compatibility Match Ring: visual percentage score based on overlapping values and interests.
   - Send Connection Request: checks monthly quota (3 free requests/month with live counter). Shows modal to upgrade to Silver, Gold, or Platinum if exhausted.
3. **Connection Requests & Privacy-Safe Handling**:
   - Recipient sees incoming request card with blurred/unblurred photo according to privacy rule.
   - **Accept**: Changes status to Connected; unlocks private encrypted chat and unblurred photo.
   - **Decline**: Silently wipes the pending card from recipient view; leaves sender card in neutral inactive state without triggering rejection notifications.
4. **End-to-End Encrypted Chat**:
   - E2EE badge and session key verification indicator. Real-time messaging with Wali chaperone mode toggle.
5. **Vendor Discovery, Booking & Reviews**:
   - Filter by service category: **Wedding Photographers**, **Bridal Makeup & Parlors**, **Catering & Chefs**, **Stages, Chairs & Tents**.
   - Filter by district, verified badge, and price bracket (LKR).
   - View detailed vendor portfolio, package inclusions, and verified customer ratings.
   - Direct booking inquiry: select event date, guest count, custom requirements, and submit request.
6. **Vendor Self-Service Portal**:
   - Registration with category, district, WhatsApp/phone, package pricing, and portfolio.
   - Trial status banner (60 days free) with countdown and subscription extension simulator.
   - Booking inquiry manager (accept/decline incoming client leads).
7. **Admin Web Portal**:
   - **Revenue & Analytics**: KPI cards with Tabular LKR figures (Total Revenue, MRR, Active Paid Subs, Trial Conversion Rate), monthly revenue area chart, and breakdown by plan type.
   - **Subscription Plan Configurator**: Interactive form to edit prices in LKR, request quotas, and feature list for Silver, Gold, Platinum member plans and Basic, Pro, Elite vendor tiers. Changes reflect immediately across the app.
   - **Approvals & Moderation**: Live photo queue with original vs compressed file size, safety check diagnostics, and Approve/Reject buttons. Vendor business review queue.
   - **Activity & Audit Stream**: Filterable live feed of all platform activities with timestamps, user IDs, and action categories.
   - **User Management**: Search members, view verification documents, toggle verified badge, or issue warnings/suspensions.

### Visual Identity & Theme
- **Aesthetic Direction**: Dignified, modern Islamic minimalism paired with Sri Lankan elegance. Deep emerald, warm gold, ivory parchment, and refined slate.
- **Palette**:
  - Dominant Canvas: Deep Midnight Slate (`#0B0F19`) in dark mode or Crisp Pearl Linen (`#F8F9FB`) in light mode.
  - Brand Primary: Regal Emerald (`#0F766E` / `#059669`) symbolizing purity and growth.
  - Accent / Royal Gold: Muted Antique Gold (`#D97706` / `#F59E0B`) for verified badges, tier upgrades, and wedding milestones.
  - Neutral Structural Surfaces: Slate cards (`#111827` / `#FFFFFF`) with subtle hairline dividers (`border-slate-200 dark:border-slate-800`).
- **Typography**:
  - Display / Headings: `Plus Jakarta Sans` with high visual weight, crisp tracking, and balanced headlines.
  - Body: Readable geometric sans (`Plus Jakarta Sans`) with standard line heights.
  - Numeric & Pricing: Tabular figures (`tabular-nums`) for LKR pricing, compatibility scores, and revenue analytics.
- **Ergonomics & Layout Modes**:
  - **App View**: Mobile touch shell (iOS/Android styled bezel toggle or responsive view) with thumb bottom bar.
  - **Admin Portal View**: Full-width executive dashboard layout with sidebar navigation, metric cards, interactive tables, and charts.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Dedicated Admin Web Portal with Revenue Analytics & Plan Configurator
- **Chosen Approach**: Build a comprehensive, desktop-optimized Admin Portal accessible via the role switcher or dedicated navigation, featuring financial revenue analytics, a live subscription plan configurator (modifying LKR pricing and quotas in real-time), an approval queue, and a user activity audit log.
- **Why**: Directly satisfies the user's requirement for a robust admin web portal to control monetization, manage vendor/user approvals, and monitor revenue performance.

### Decision 2: Vendor Self-Service Registration & 2-Month Free Trial
- **Chosen Approach**: Built-in vendor registration modal and dedicated Vendor Dashboard that computes trial expiration based on registration timestamp (defaults to 60 days free). Vendors can view remaining days, toggle visibility, and simulate subscription renewals with immediate visual state feedback.
- **Why**: Directly satisfies the user's business model to charge for posting services after a 2-month introductory period, encouraging high vendor adoption first.

### Decision 3: Image Moderation & Compression Pipeline
- **Chosen Approach**: Real client-side canvas-based image resizing and compression (JPEG/WebP quality reduction with size savings calculator), combined with automated heuristic safety scanning (nudity/malicious script detection) + live Admin Queue.
- **Why**: Protects user bandwidth, preserves cloud storage, prevents inappropriate content from ever being publicly rendered, and demonstrates the exact production workflow requested.

### Decision 4: Tier Quota & Silent Rejection Architecture
- **Chosen Approach**: Strict client state tracking remaining free requests (out of 3 per month), tier upgrade simulation (Silver: 10/month, Gold: 25/month, Platinum: Unlimited + profile spotlight), and silent state purging on rejection.
- **Why**: Matches the user's specific privacy and anti-harassment specification.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 NIKAHTENT ROOT APPLICATION                                  │
│  ┌───────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ Top Bar: Brand, District Selector, Role Switcher (Member / Vendor / Admin Web Portal), │  │
│  │ Viewport Shell Toggle (Responsive Mobile Frame / Full Desktop), Notifications Center  │  │
│  └───────────────────────────────────────────────────────────────────────────────────────┘  │
│                                           │                                                 │
│         ┌─────────────────────────────────┼─────────────────────────────────┐               │
│         ▼                                 ▼                                 ▼               │
│  ┌─────────────────────────────┐   ┌─────────────────────────────┐   ┌────────────────────┐ │
│  │     MATRIMONY (MOBILE)      │   │     VENDORS MARKETPLACE     │   │  ADMIN WEB PORTAL  │ │
│  │ • Match Feed & Compatibility│   │ • Photographers & Video     │   │ • Revenue & MRR    │ │
│  │ • Wali / Self Registration  │   │ • Bridal Makeup & Parlors   │   │   Analytics (LKR)  │ │
│  │ • 3 Free Requests / Tiers   │   │ • Catering & Master Chefs   │   │ • Plan Configurator│ │
│  │ • Photo Privacy Controls    │   │ • Stages, Chairs & Tents    │   │   (Pricing/Quotas) │ │
│  │ • Silent Decline Mechanism  │   │ • Vendor Self-Registration  │   │ • Media Approvals  │ │
│  │ • E2EE Encrypted Messaging  │   │ • 2-Month Free Trial Engine │   │ • Activity Log     │ │
│  │ • Safety Reporting & Block  │   │ • Booking Inquiries & Rating│   │ • User Management  │ │
│  └─────────────────────────────┘   └─────────────────────────────┘   └────────────────────┘ │
│                                           │                                                 │
│         ┌─────────────────────────────────┴─────────────────────────────────┐               │
│         ▼                                                                   ▼               │
│  ┌────────────────────────────────────┐                   ┌───────────────────────────────┐ │
│  │      NOTIFICATION ENGINE           │                   │     SHARED PERSISTENCE        │ │
│  │ • Image Approval/Rejection Push    │                   │ • User Profiles & Privacy     │ │
│  │ • Instant Connection Request Alerts│                   │ • Subscription Configurations │ │
│  │ • Vendor Booking Alerts            │                   │ • Revenue & Payment Records   │ │
│  │ • Trial Expiration Alerts          │                   │ • Audit Trail & Event Logs    │ │
│  └────────────────────────────────────┘                   └───────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Core Entities & State Model
- **Subscription Configs**:
  - Member Plans: Free (3 req/mo), Silver (10 req/mo, LKR 2,500), Gold (25 req/mo, LKR 5,000), Platinum (Unlimited, LKR 9,500).
  - Vendor Plans: Free Trial (60 days), Standard Listing (LKR 4,500/mo), Featured Spotlight (LKR 8,500/mo), Elite Enterprise (LKR 15,000/mo).
- **Revenue Records**: Transaction ID, payerName, payerType (`member` | `vendor`), planName, amountLKR, timestamp, paymentStatus.
- **User Profile**: ID, name, registeredBy (`self` | `wali`), gender, age, district (Sri Lanka), education, occupation, religiousValues, personalityTraits, bio, photoUrl, photoPrivacy (`public` | `blurred_until_accepted` | `locked`), idVerified, approvalStatus (`approved` | `pending` | `rejected`), tier (`free` | `silver` | `gold` | `platinum`), monthlyRequestsUsed.
- **Vendor Listing**: ID, name, category (`photographer` | `beautician` | `catering` | `chef` | `stage_decor` | `tent_chairs`), district, rating, reviewCount, startingPriceLKR, portfolioImages, packages, femaleCrewAvailable, registeredAt, trialExpiresAt, subscriptionStatus (`trial_active` | `subscription_active` | `expired`), isVisible, inquiries.
- **Activity Log Item**: ID, timestamp, actorName, actorRole (`user` | `vendor` | `admin`), actionType, description, severity (`info` | `success` | `warning` | `critical`).
- **Image Moderation Item**: ID, userId, originalFileName, originalSize, compressedSize, scanResult (`clean` | `flagged`), status (`pending` | `approved` | `rejected`), rejectionReason.
- **Connection Request**: ID, senderId, recipientId, status (`pending` | `accepted` | `declined`), timestamp.
- **E2EE Chat Message**: ID, conversationId, senderId, text, timestamp, encryptedHash, chaperoneEnabled.

### Verification & Testing Plan
- Test Admin Revenue Dashboard: verify LKR gross revenue, MRR, trial conversion percentage, and financial charts.
- Test Admin Subscription Configurator: edit tier prices and request quotas, verify instant update across member and vendor upgrade modals.
- Test Admin Moderation Queue: approve/reject profile photos with live notifications sent to member accounts.
- Test Admin Activity Audit Log: verify real-time event recording on user registration, request sending, and vendor bookings.
- Test Vendor Portal: vendor registration, 60-day free trial counter, subscription renewal simulation, and booking inquiry management.
- Test Matrimony App: personality matching, photo privacy blurring, 3 free monthly requests quota, silent rejection, and E2EE chat.
- Verify zero build/lint errors and test responsive/desktop view integrity.
