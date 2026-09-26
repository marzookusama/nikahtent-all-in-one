export type RegistrationRole = 'self' | 'parent' | 'brother' | 'sister' | 'wali';

export type PhotoPrivacy = 'public' | 'blurred_until_accepted' | 'locked';

export type UserTier = 'free' | 'silver' | 'gold' | 'platinum';

export type ReligiousPractice = 'Practicing Sunni' | 'Moderate' | 'Very Practicing' | 'Culturally Traditional';

export interface UserProfile {
  id: string;
  name: string;
  registeredBy: RegistrationRole;
  gender: 'male' | 'female';
  age: number;
  height: string;
  district: string;
  city: string;
  education: string;
  occupation: string;
  employerOrField: string;
  religiousPractice: ReligiousPractice;
  personalityTraits: string[];
  values: string[];
  bio: string;
  photoUrl: string;
  photoPrivacy: PhotoPrivacy;
  idVerified: boolean;
  approvalStatus: 'approved' | 'pending' | 'rejected';
  rejectionReason?: string;
  tier: UserTier;
  monthlyRequestsUsed: number;
  monthlyRequestsLimit: number; // 3 for free, 15 for silver, 35 for gold, 999 for platinum
  contactChaperonePhone: string;
  languages: string[];
  maritalStatus: 'Never Married' | 'Divorced' | 'Widowed';
  smokingHabit: 'Non-Smoker' | 'Social';
  dietaryPreference: 'Halal Only' | 'Strict Halal';
  isReported?: boolean;
  isBlocked?: boolean;
}

export interface ConnectionRequest {
  id: string;
  senderId: string;
  recipientId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  note?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isEncrypted: boolean;
  encryptedHash: string;
}

export interface ImageModerationItem {
  id: string;
  userId: string;
  userName: string;
  originalFileName: string;
  originalSizeKb: number;
  compressedSizeKb: number;
  compressionRatio: string;
  scanResult: 'clean' | 'flagged';
  scanDetails: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  uploadedAt: string;
  imageUrl: string;
}

export type VendorCategory = 
  | 'beautician' 
  | 'catering' 
  | 'chef' 
  | 'stage_decor' 
  | 'tent_chairs' 
  | 'photo_shooter';

export interface VendorPackage {
  id: string;
  title: string;
  priceLKR: number;
  features: string[];
}

export interface VendorReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface VendorListing {
  id: string;
  name: string;
  businessName: string;
  category: VendorCategory;
  district: string;
  address: string;
  rating: number;
  reviewCount: number;
  startingPriceLKR: number;
  priceUnit: string;
  portfolioImages: string[];
  packages: VendorPackage[];
  isVerified: boolean;
  subscriptionStatus: 'trial_active' | 'subscribed' | 'expired';
  trialDaysLeft: number;
  description: string;
  contactPhone: string;
  whatsapp: string;
  reviews: VendorReview[];
  ownerId: string;
}

export interface VendorBooking {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorCategory: VendorCategory;
  userId: string;
  userName: string;
  eventDate: string;
  guestCount: number;
  packageTitle: string;
  priceLKR: number;
  status: 'inquiry' | 'confirmed' | 'completed' | 'declined';
  createdAt: string;
  notes: string;
}

export interface SubscriptionPlanConfig {
  id: string;
  code: string;
  name: string;
  targetType: 'matrimony' | 'vendor';
  priceMonthlyLKR: number;
  priceYearlyLKR: number;
  requestLimit: number | 'unlimited';
  features: string[];
  isActive: boolean;
  badgeText?: string;
}

export interface UserActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
  ipOrLocation: string;
  category: 'auth' | 'request' | 'chat' | 'moderation' | 'subscription' | 'booking';
}

export interface SystemNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'image_status' | 'connection_request' | 'connection_accepted' | 'booking_status' | 'subscription_alert';
}
