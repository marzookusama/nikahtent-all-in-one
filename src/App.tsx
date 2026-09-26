import React, { useState } from 'react';
import { Header, AppViewMode } from './components/Header';
import { MatrimonyHub } from './components/MatrimonyHub';
import { VendorHub } from './components/VendorHub';
import { AdminPortal } from './components/AdminPortal';
import { VendorDashboard } from './components/VendorDashboard';
import { SubscriptionModal } from './components/SubscriptionModal';
import { NotificationsModal } from './components/NotificationsModal';
import { ProfileCreatorModal } from './components/ProfileCreatorModal';
import { MobileFrameWrapper } from './components/MobileFrameWrapper';

import {
  CURRENT_USER,
  SEED_PROFILES,
  SEED_VENDORS,
  INITIAL_SUBSCRIPTION_PLANS,
  INITIAL_IMAGE_MODERATION,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_NOTIFICATIONS
} from './data/seedData';

import {
  UserProfile,
  ConnectionRequest,
  ChatMessage,
  VendorListing,
  VendorBooking,
  VendorReview,
  SubscriptionPlanConfig,
  ImageModerationItem,
  UserActivityLog,
  SystemNotification,
  UserTier
} from './types';
import { simulateEncryptMessage } from './utils/encryption';

export default function App() {
  // Navigation & View Mode
  const [currentView, setCurrentView] = useState<AppViewMode>('matrimony');
  const [userRole, setUserRole] = useState<'member' | 'admin' | 'vendor'>('member');
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  // Application State
  const [currentUser, setCurrentUser] = useState<UserProfile>(CURRENT_USER);
  const [profiles, setProfiles] = useState<UserProfile[]>([CURRENT_USER, ...SEED_PROFILES]);
  
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([
    {
      id: 'req_01',
      senderId: 'usr_02', // Fatima sent to Ziyad
      recipientId: CURRENT_USER.id,
      status: 'pending',
      createdAt: '1 hour ago',
      note: 'Assalamu Alaikum. Our parents viewed your profile and would like to explore this match for marriage.'
    }
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_01',
      conversationId: [CURRENT_USER.id, 'usr_03'].sort().join('_'),
      senderId: 'usr_03',
      senderName: 'Amina Cassim',
      text: 'Assalamu Alaikum brother Ziyad. Thank you for connecting. My father is available to speak this Saturday InshaAllah.',
      timestamp: '10:30 AM',
      isEncrypted: true,
      encryptedHash: '0x8F4A19B2'
    }
  ]);

  const [moderationQueue, setModerationQueue] = useState<ImageModerationItem[]>(INITIAL_IMAGE_MODERATION);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlanConfig[]>(INITIAL_SUBSCRIPTION_PLANS);
  const [activityLogs, setActivityLogs] = useState<UserActivityLog[]>(INITIAL_ACTIVITY_LOGS);
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);
  const [vendors, setVendors] = useState<VendorListing[]>(SEED_VENDORS);

  const [vendorBookings, setVendorBookings] = useState<VendorBooking[]>([
    {
      id: 'bkg_01',
      vendorId: 'vnd_01',
      vendorName: "Farzana's Bridal Henna & Glamour",
      vendorCategory: 'beautician',
      userId: CURRENT_USER.id,
      userName: CURRENT_USER.name,
      eventDate: '2026-11-28',
      guestCount: 300,
      packageTitle: 'Grand Walima Signature',
      priceLKR: 85000,
      status: 'inquiry',
      createdAt: 'Yesterday',
      notes: 'Bridal room setup at Cinnamon Lakeside, Colombo.'
    }
  ]);

  // Modal Open States
  const [isTierModalOpen, setIsTierModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileCreatorOpen, setIsProfileCreatorOpen] = useState(false);

  // Unread notification count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // --- ACTIONS & HANDLERS ---

  // 1. Send Connection Request (Checks and consumes 1 of 3 free requests/month)
  const handleSendConnectionRequest = (recipientId: string, note?: string) => {
    const remaining = currentUser.monthlyRequestsLimit - currentUser.monthlyRequestsUsed;
    if (remaining <= 0 && currentUser.monthlyRequestsLimit <= 100) {
      setIsTierModalOpen(true);
      return;
    }

    const newReq: ConnectionRequest = {
      id: `req_${Date.now()}`,
      senderId: currentUser.id,
      recipientId,
      status: 'pending',
      createdAt: 'Just now',
      note
    };

    setConnectionRequests((prev) => [...prev, newReq]);

    // Update monthly quota
    setCurrentUser((prev) => ({
      ...prev,
      monthlyRequestsUsed: prev.monthlyRequestsUsed + 1
    }));

    // Log Activity
    const recipient = profiles.find((p) => p.id === recipientId);
    setActivityLogs((prev) => [
      {
        id: `act_${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        action: 'Connection Request Dispatched',
        details: `Sent monthly request (${currentUser.monthlyRequestsUsed + 1}/${currentUser.monthlyRequestsLimit}) to ${recipient?.name || 'Candidate'}`,
        timestamp: 'Just now',
        ipOrLocation: `${currentUser.city}, Sri Lanka`,
        category: 'request'
      },
      ...prev
    ]);
  };

  // 2. Accept Connection Request -> Unlocks Encrypted Chat & Unblurs photo
  const handleAcceptConnectionRequest = (requestId: string) => {
    const req = connectionRequests.find((r) => r.id === requestId);
    if (!req) return;

    setConnectionRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'accepted' } : r))
    );

    const partner = profiles.find((p) => p.id === req.senderId);

    // Automated Push Notification
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        userId: currentUser.id,
        title: 'Connection Accepted',
        message: `You are now connected with ${partner?.name || 'Candidate'}. Private E2EE chat is now unlocked.`,
        timestamp: 'Just now',
        isRead: false,
        type: 'connection_accepted'
      },
      ...prev
    ]);

    // Log Activity
    setActivityLogs((prev) => [
      {
        id: `act_${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        action: 'Connection Request Accepted',
        details: `Mutual connection established between ${currentUser.name} and ${partner?.name}`,
        timestamp: 'Just now',
        ipOrLocation: 'Colombo, Western Province',
        category: 'request'
      },
      ...prev
    ]);
  };

  // 3. SILENT DECLINE REQUEST
  // (Permanently purged, sender receives NO notification to protect dignity & prevent harassment!)
  const handleDeclineConnectionRequest = (requestId: string) => {
    setConnectionRequests((prev) => prev.filter((r) => r.id !== requestId));

    // Log internal security event without alerting the sender
    setActivityLogs((prev) => [
      {
        id: `act_${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        action: 'Request Silently Declined',
        details: 'Connection request silently purged per privacy and anti-harassment policy.',
        timestamp: 'Just now',
        ipOrLocation: 'Colombo, Sri Lanka',
        category: 'request'
      },
      ...prev
    ]);
  };

  // 4. Send Private E2EE Message
  const handleSendMessage = (conversationId: string, text: string) => {
    const { hash } = simulateEncryptMessage(text);
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isEncrypted: true,
      encryptedHash: hash
    };

    setChatMessages((prev) => [...prev, newMsg]);
  };

  // 5. Block & Report Account
  const handleBlockUser = (targetUserId: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === targetUserId ? { ...p, isBlocked: true } : p))
    );
    setActivityLogs((prev) => [
      {
        id: `act_${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        action: 'User Blocked',
        details: `User ${targetUserId} was blocked from communications.`,
        timestamp: 'Just now',
        ipOrLocation: 'Colombo, Sri Lanka',
        category: 'moderation'
      },
      ...prev
    ]);
  };

  const handleReportUser = (targetUserId: string, reason: string) => {
    const target = profiles.find((p) => p.id === targetUserId);
    setActivityLogs((prev) => [
      {
        id: `act_${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        action: 'Account Reported to Admin',
        details: `Report lodged against ${target?.name || targetUserId}: ${reason}`,
        timestamp: 'Just now',
        ipOrLocation: 'Colombo, Sri Lanka',
        category: 'moderation'
      },
      ...prev
    ]);

    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        userId: currentUser.id,
        title: 'Report Received by Compliance',
        message: `Thank you for safeguarding our community. Our admin team is reviewing ${target?.name}'s account.`,
        timestamp: 'Just now',
        isRead: false,
        type: 'image_status'
      },
      ...prev
    ]);
  };

  // 6. Admin Approves Photo -> Automated Notification Triggered to User
  const handleApproveImage = (itemId: string) => {
    const item = moderationQueue.find((i) => i.id === itemId);
    if (!item) return;

    setModerationQueue((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, status: 'approved' } : i))
    );

    // Update profile
    setProfiles((prev) =>
      prev.map((p) => (p.id === item.userId ? { ...p, approvalStatus: 'approved' } : p))
    );
    if (currentUser.id === item.userId) {
      setCurrentUser((prev) => ({ ...prev, approvalStatus: 'approved' }));
    }

    // AUTOMATED USER NOTIFICATION
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        userId: item.userId,
        title: 'Profile Photo Approved & Published',
        message: `Assalamu Alaikum ${item.userName}, your profile photo has passed manual admin inspection and is now visible according to your privacy rules.`,
        timestamp: 'Just now',
        isRead: false,
        type: 'image_status'
      },
      ...prev
    ]);

    setActivityLogs((prev) => [
      {
        id: `act_${Date.now()}`,
        userId: 'admin_sys',
        userName: 'Admin Moderator',
        action: 'Photo Approved',
        details: `Approved profile picture for ${item.userName} (${item.compressedSizeKb} KB compressed)`,
        timestamp: 'Just now',
        ipOrLocation: 'Admin Portal (HQ)',
        category: 'moderation'
      },
      ...prev
    ]);
  };

  // 7. Admin Rejects Photo -> Automated Notification Triggered to User
  const handleRejectImage = (itemId: string, reason: string) => {
    const item = moderationQueue.find((i) => i.id === itemId);
    if (!item) return;

    setModerationQueue((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, status: 'rejected', rejectionReason: reason } : i))
    );

    // Update profile
    setProfiles((prev) =>
      prev.map((p) => (p.id === item.userId ? { ...p, approvalStatus: 'rejected', rejectionReason: reason } : p))
    );
    if (currentUser.id === item.userId) {
      setCurrentUser((prev) => ({ ...prev, approvalStatus: 'rejected', rejectionReason: reason }));
    }

    // AUTOMATED USER NOTIFICATION
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        userId: item.userId,
        title: 'Action Needed: Photo Not Approved',
        message: `Your uploaded image was rejected due to: "${reason}". Please upload a clear, modest personal portrait.`,
        timestamp: 'Just now',
        isRead: false,
        type: 'image_status'
      },
      ...prev
    ]);

    setActivityLogs((prev) => [
      {
        id: `act_${Date.now()}`,
        userId: 'admin_sys',
        userName: 'Admin Moderator',
        action: 'Photo Rejected',
        details: `Rejected image for ${item.userName}. Reason: ${reason}`,
        timestamp: 'Just now',
        ipOrLocation: 'Admin Portal (HQ)',
        category: 'moderation'
      },
      ...prev
    ]);
  };

  // 8. Admin Updates Subscription Plan Configuration
  const handleUpdatePlan = (updatedPlan: SubscriptionPlanConfig) => {
    setSubscriptionPlans((prev) =>
      prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
    );
    setActivityLogs((prev) => [
      {
        id: `act_${Date.now()}`,
        userId: 'admin_sys',
        userName: 'Admin Billing',
        action: 'Subscription Pricing Updated',
        details: `Updated ${updatedPlan.name} monthly price to LKR ${updatedPlan.priceMonthlyLKR.toLocaleString()}`,
        timestamp: 'Just now',
        ipOrLocation: 'Admin Portal (HQ)',
        category: 'subscription'
      },
      ...prev
    ]);
  };

  // 9. Admin Toggles NIC Verification
  const handleToggleUserVerification = (userId: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === userId ? { ...p, idVerified: !p.idVerified } : p))
    );
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, idVerified: !prev.idVerified }));
    }
  };

  // 10. Admin Suspends / Bans User
  const handleToggleUserBan = (userId: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === userId ? { ...p, isBlocked: !p.isBlocked } : p))
    );
  };

  // 11. Book Vendor
  const handleBookVendor = (booking: Omit<VendorBooking, 'id' | 'createdAt'>) => {
    const newBooking: VendorBooking = {
      ...booking,
      id: `bkg_${Date.now()}`,
      createdAt: 'Just now'
    };
    setVendorBookings((prev) => [newBooking, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        userId: currentUser.id,
        title: 'Vendor Booking Inquiry Dispatched',
        message: `Your booking inquiry for ${booking.vendorName} (${booking.packageTitle}) has been submitted. The vendor will contact you shortly.`,
        timestamp: 'Just now',
        isRead: false,
        type: 'booking_status'
      },
      ...prev
    ]);

    setActivityLogs((prev) => [
      {
        id: `act_${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        action: 'Vendor Booking Inquiry',
        details: `Requested ${booking.packageTitle} from ${booking.vendorName} on ${booking.eventDate}`,
        timestamp: 'Just now',
        ipOrLocation: 'Colombo, Sri Lanka',
        category: 'booking'
      },
      ...prev
    ]);
  };

  // 12. Register New Wedding Vendor (with 2 Months Free Trial)
  const handleRegisterVendor = (vendorData: Omit<VendorListing, 'id' | 'reviews' | 'rating' | 'reviewCount'>) => {
    const newVendor: VendorListing = {
      ...vendorData,
      id: `vnd_${Date.now()}`,
      reviews: [],
      rating: 5.0,
      reviewCount: 0
    };

    setVendors((prev) => [newVendor, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        userId: currentUser.id,
        title: 'Vendor Listing Active — 2 Months Free',
        message: `Congratulations! ${vendorData.businessName} is now live on Nikahtent with your 60-day free trial active.`,
        timestamp: 'Just now',
        isRead: false,
        type: 'subscription_alert'
      },
      ...prev
    ]);

    setActivityLogs((prev) => [
      {
        id: `act_${Date.now()}`,
        userId: currentUser.id,
        userName: vendorData.name,
        action: 'Vendor Partner Onboarded',
        details: `Registered ${vendorData.businessName} under category ${vendorData.category} (2-Month Free Trial)`,
        timestamp: 'Just now',
        ipOrLocation: `${vendorData.district}, Sri Lanka`,
        category: 'booking'
      },
      ...prev
    ]);
  };

  // 13. Add Verified Review
  const handleAddReview = (vendorId: string, review: Omit<VendorReview, 'id' | 'date'>) => {
    setVendors((prev) =>
      prev.map((v) => {
        if (v.id !== vendorId) return v;
        const newReview: VendorReview = {
          ...review,
          id: `rev_${Date.now()}`,
          date: 'Just now'
        };
        const updatedReviews = [newReview, ...v.reviews];
        const newAvg =
          updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length;

        return {
          ...v,
          reviews: updatedReviews,
          rating: Number(newAvg.toFixed(1)),
          reviewCount: v.reviewCount + 1
        };
      })
    );
  };

  // 14. Update / Save Profile from Creator Modal
  const handleSaveProfile = (profilePayload: Partial<UserProfile>, imageModerationData?: any) => {
    const updatedUser: UserProfile = {
      ...currentUser,
      ...profilePayload
    } as UserProfile;

    setCurrentUser(updatedUser);
    setProfiles((prev) => [updatedUser, ...prev.filter((p) => p.id !== updatedUser.id)]);

    // If an image was compressed & uploaded, add it to admin moderation queue
    if (imageModerationData) {
      const newModItem: ImageModerationItem = {
        id: `mod_${Date.now()}`,
        userId: updatedUser.id,
        userName: updatedUser.name,
        originalFileName: imageModerationData.originalFileName,
        originalSizeKb: imageModerationData.originalSizeKb,
        compressedSizeKb: imageModerationData.compressedSizeKb,
        compressionRatio: imageModerationData.compressionRatio,
        scanResult: imageModerationData.scanResult,
        scanDetails: imageModerationData.scanDetails,
        status: 'pending',
        uploadedAt: 'Just now',
        imageUrl: imageModerationData.imageUrl
      };

      setModerationQueue((prev) => [newModItem, ...prev]);

      // Automated notification for pending status
      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}`,
          userId: updatedUser.id,
          title: 'Photo Uploaded — Pending Admin Review',
          message: 'Your profile photo was compressed and passed automated security scan. Our admin will review it shortly.',
          timestamp: 'Just now',
          isRead: false,
          type: 'image_status'
        },
        ...prev
      ]);
    }
  };

  // 15. Tier Upgrade
  const handleSelectTier = (tier: UserTier) => {
    const limits: Record<UserTier, number> = {
      free: 3,
      silver: 15,
      gold: 35,
      platinum: 999
    };

    setCurrentUser((prev) => ({
      ...prev,
      tier,
      monthlyRequestsLimit: limits[tier]
    }));

    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        userId: currentUser.id,
        title: `Upgraded to ${tier.toUpperCase()} Tier`,
        message: `Mubarak! You now have ${limits[tier] === 999 ? 'unlimited' : limits[tier]} monthly profile requests.`,
        timestamp: 'Just now',
        isRead: false,
        type: 'subscription_alert'
      },
      ...prev
    ]);

    setActivityLogs((prev) => [
      {
        id: `act_${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        action: 'Membership Tier Upgrade',
        details: `Subscribed to ${tier.toUpperCase()} membership plan`,
        timestamp: 'Just now',
        ipOrLocation: 'Colombo, Western Province',
        category: 'subscription'
      },
      ...prev
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-['Plus_Jakarta_Sans'] antialiased">
      {/* Top Bar Header */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadCount={unreadCount}
        userRole={userRole}
        onRoleChange={setUserRole}
        onOpenProfileCreator={() => setIsProfileCreatorOpen(true)}
        onOpenTierModal={() => setIsTierModalOpen(true)}
      />

      {/* Main View Shell (Responsive Web or Mobile Smartphone Frame) */}
      <MobileFrameWrapper
        isMobileFrame={isMobileFrame}
        currentView={currentView}
        onViewChange={setCurrentView}
      >
        {currentView === 'matrimony' && (
          <MatrimonyHub
            currentUser={currentUser}
            profiles={profiles}
            connectionRequests={connectionRequests}
            onSendConnectionRequest={handleSendConnectionRequest}
            onAcceptConnectionRequest={handleAcceptConnectionRequest}
            onDeclineConnectionRequest={handleDeclineConnectionRequest}
            onOpenTierModal={() => setIsTierModalOpen(true)}
            onOpenProfileCreator={() => setIsProfileCreatorOpen(true)}
            onBlockUser={handleBlockUser}
            onReportUser={handleReportUser}
            chatMessages={chatMessages}
            onSendMessage={handleSendMessage}
          />
        )}

        {currentView === 'vendors' && (
          <VendorHub
            vendors={vendors}
            onBookVendor={handleBookVendor}
            onRegisterVendor={handleRegisterVendor}
            onAddReview={handleAddReview}
            currentUserId={currentUser.id}
            currentUserName={currentUser.name}
          />
        )}

        {currentView === 'admin' && (
          <AdminPortal
            moderationQueue={moderationQueue}
            onApproveImage={handleApproveImage}
            onRejectImage={handleRejectImage}
            subscriptionPlans={subscriptionPlans}
            onUpdatePlan={handleUpdatePlan}
            activityLogs={activityLogs}
            profiles={profiles}
            onToggleUserVerification={handleToggleUserVerification}
            onToggleUserBan={handleToggleUserBan}
            vendors={vendors}
            onToggleVendorVerified={(id) => {
              setVendors((prev) =>
                prev.map((v) => (v.id === id ? { ...v, isVerified: !v.isVerified } : v))
              );
            }}
          />
        )}

        {currentView === 'vendor_dashboard' && (
          <VendorDashboard
            currentVendor={vendors[0]}
            bookings={vendorBookings}
            onUpdateBookingStatus={(bookingId, status) => {
              setVendorBookings((prev) =>
                prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
              );
            }}
            onAddPackage={(vendorId, pkg) => {
              setVendors((prev) =>
                prev.map((v) =>
                  v.id === vendorId
                    ? {
                        ...v,
                        packages: [...v.packages, { ...pkg, id: `pkg_${Date.now()}` }]
                      }
                    : v
                )
              );
            }}
          />
        )}
      </MobileFrameWrapper>

      {/* Global Modals */}
      <SubscriptionModal
        isOpen={isTierModalOpen}
        onClose={() => setIsTierModalOpen(false)}
        currentTier={currentUser.tier}
        plans={subscriptionPlans}
        onSelectTier={handleSelectTier}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        }}
        onClearAll={() => setNotifications([])}
      />

      <ProfileCreatorModal
        isOpen={isProfileCreatorOpen}
        onClose={() => setIsProfileCreatorOpen(false)}
        onSaveProfile={handleSaveProfile}
        initialProfile={currentUser}
      />
    </div>
  );
}
