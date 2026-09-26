import React, { useState, useMemo } from 'react';
import { 
  Heart, 
  ShieldCheck, 
  Lock, 
  Eye, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Sparkles, 
  UserPlus, 
  MessageSquare, 
  Send, 
  SlidersHorizontal, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  ArrowRight, 
  EyeOff, 
  Zap,
  Info
} from 'lucide-react';
import { 
  UserProfile, 
  ConnectionRequest, 
  ChatMessage, 
  UserTier, 
  SubscriptionPlanConfig 
} from '../types';
import { calculateCompatibility } from '../utils/compatibility';
import { createE2EESession, simulateEncryptMessage } from '../utils/encryption';
import { compressImage, scanImageForThreats } from '../utils/imageProcessor';

interface MatrimonyHubProps {
  currentUser: UserProfile;
  profiles: UserProfile[];
  connectionRequests: ConnectionRequest[];
  onSendConnectionRequest: (recipientId: string, note?: string) => void;
  onAcceptConnectionRequest: (requestId: string) => void;
  onDeclineConnectionRequest: (requestId: string) => void; // Silent decline
  onOpenTierModal: () => void;
  onOpenProfileCreator: () => void;
  onBlockUser: (targetUserId: string) => void;
  onReportUser: (targetUserId: string, reason: string) => void;
  chatMessages: ChatMessage[];
  onSendMessage: (conversationId: string, text: string) => void;
}

export const MatrimonyHub: React.FC<MatrimonyHubProps> = ({
  currentUser,
  profiles,
  connectionRequests,
  onSendConnectionRequest,
  onAcceptConnectionRequest,
  onDeclineConnectionRequest,
  onOpenTierModal,
  onOpenProfileCreator,
  onBlockUser,
  onReportUser,
  chatMessages,
  onSendMessage
}) => {
  // Filters
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<'all' | 'female' | 'male'>('female');
  const [selectedRegisteredBy, setSelectedRegisteredBy] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTraitFilter, setSelectedTraitFilter] = useState<string>('All');

  // Active Modals & Drawers
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [showRequestsDrawer, setShowRequestsDrawer] = useState(false);
  const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);
  const [chatInputText, setChatInputText] = useState('');
  const [isChaperoneModeActive, setIsChaperoneModeActive] = useState(true);
  const [reportingUserId, setReportingUserId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('Inappropriate communication');
  const [requestNoteInput, setRequestNoteInput] = useState('');
  const [sendingRequestToProfile, setSendingRequestToProfile] = useState<UserProfile | null>(null);

  // Incoming & Outgoing requests
  const incomingRequests = useMemo(() => {
    return connectionRequests.filter(
      (r) => r.recipientId === currentUser.id && r.status === 'pending'
    );
  }, [connectionRequests, currentUser.id]);

  const acceptedRequests = useMemo(() => {
    return connectionRequests.filter(
      (r) =>
        (r.recipientId === currentUser.id || r.senderId === currentUser.id) &&
        r.status === 'accepted'
    );
  }, [connectionRequests, currentUser.id]);

  const sentRequestIds = useMemo(() => {
    return new Set(
      connectionRequests
        .filter((r) => r.senderId === currentUser.id && r.status === 'pending')
        .map((r) => r.recipientId)
    );
  }, [connectionRequests, currentUser.id]);

  const connectedUserIds = useMemo(() => {
    const ids = new Set<string>();
    acceptedRequests.forEach((r) => {
      ids.add(r.senderId === currentUser.id ? r.recipientId : r.senderId);
    });
    return ids;
  }, [acceptedRequests, currentUser.id]);

  // Filter profiles
  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      if (p.id === currentUser.id) return false;
      if (p.isBlocked) return false;

      // Gender filter
      if (selectedGender !== 'all' && p.gender !== selectedGender) return false;

      // District filter
      if (selectedDistrict !== 'All' && p.district !== selectedDistrict) return false;

      // Registered by filter
      if (selectedRegisteredBy !== 'All' && p.registeredBy !== selectedRegisteredBy) return false;

      // Trait filter
      if (selectedTraitFilter !== 'All' && !p.personalityTraits.includes(selectedTraitFilter)) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesOccupation = p.occupation.toLowerCase().includes(query);
        const matchesEducation = p.education.toLowerCase().includes(query);
        const matchesCity = p.city.toLowerCase().includes(query);
        if (!matchesName && !matchesOccupation && !matchesEducation && !matchesCity) return false;
      }

      return true;
    });
  }, [profiles, currentUser.id, selectedGender, selectedDistrict, selectedRegisteredBy, selectedTraitFilter, searchQuery]);

  // Sri Lanka districts list
  const sriLankaDistricts = [
    'All',
    'Colombo',
    'Kandy',
    'Galle',
    'Gampaha',
    'Kalutara',
    'Kurunegala',
    'Ampara',
    'Batticaloa',
    'Trincomalee',
    'Matale',
    'Puttalam',
    'Matara',
    'Badulla',
    'Ratnapura'
  ];

  const popularTraits = [
    'All',
    'Family-Oriented',
    'Career-Focused',
    'Culinary Enthusiast',
    'Book Lover',
    'Traveler',
    'Active / Fitness',
    'Creative'
  ];

  // Remaining requests calculation
  const remainingRequests = Math.max(0, currentUser.monthlyRequestsLimit - currentUser.monthlyRequestsUsed);
  const isUnlimited = currentUser.monthlyRequestsLimit > 100;

  // Active chat profile
  const activeChatProfile = profiles.find((p) => p.id === activeChatUserId);
  const activeConversationId = activeChatUserId ? [currentUser.id, activeChatUserId].sort().join('_') : null;
  const currentConversationMessages = chatMessages.filter(
    (m) => m.conversationId === activeConversationId
  );

  const e2eeSession = activeChatUserId ? createE2EESession(currentUser.id, activeChatUserId) : null;

  return (
    <div className="space-y-6 pb-16">
      {/* Hero Atmosphere Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 text-white shadow-xl">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="/src/assets/images/hero_sri_lanka_nikah_1790449981525.jpg"
            alt="Sri Lankan Nikah Matrimony Atmosphere"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/85 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-amber-400 font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Sri Lankan Muslim Matrimonial Hub
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white text-balance font-['Plus_Jakarta_Sans'] leading-tight">
            Finding Your Halal Partner with Dignity & Family Harmony
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            Register for yourself or on behalf of your family members with verified NIC authenticity, personality compatibility matching, strict photo privacy, and End-to-End encrypted chaperone conversations.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenProfileCreator}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create / Manage Profile</span>
            </button>

            <button
              onClick={() => setShowRequestsDrawer(true)}
              className="relative px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-xl border border-white/20 transition-all flex items-center gap-2"
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Connection Requests</span>
              {incomingRequests.length > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                  {incomingRequests.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Monthly Quota Tracker & Membership Status */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-900 rounded-2xl p-4 sm:p-5 border border-emerald-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
            {isUnlimited ? '∞' : `${remainingRequests}`}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Monthly Profile Request Quota
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                {currentUser.tier} Plan
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {isUnlimited
                ? 'You have unlimited connection requests available this month.'
                : `You have used ${currentUser.monthlyRequestsUsed} of ${currentUser.monthlyRequestsLimit} free monthly requests.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={onOpenTierModal}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Upgrade to Unlimited</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by career, education, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* District selector */}
          <div>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="All">All Sri Lankan Districts</option>
              {sriLankaDistricts.filter((d) => d !== 'All').map((d) => (
                <option key={d} value={d}>District: {d}</option>
              ))}
            </select>
          </div>

          {/* Gender / Profile Type */}
          <div>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value as 'all' | 'female' | 'male')}
              className="w-full py-2 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="female">Seeking Brides (Female Profiles)</option>
              <option value="male">Seeking Grooms (Male Profiles)</option>
              <option value="all">View All Profiles</option>
            </select>
          </div>

          {/* Registered By */}
          <div>
            <select
              value={selectedRegisteredBy}
              onChange={(e) => setSelectedRegisteredBy(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="All">All Registration Modes</option>
              <option value="self">Registered by Self</option>
              <option value="parent">Registered by Parent</option>
              <option value="wali">Registered by Wali / Guardian</option>
              <option value="sister">Registered by Sibling</option>
            </select>
          </div>
        </div>

        {/* Personality Traits segmented tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" />
            Traits:
          </span>
          {popularTraits.map((trait) => (
            <button
              key={trait}
              onClick={() => setSelectedTraitFilter(trait)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedTraitFilter === trait
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {trait}
            </button>
          ))}
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfiles.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <Heart className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              No matching profiles found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Try adjusting your district or personality trait filter to discover more verified Muslim matrimonial matches.
            </p>
          </div>
        ) : (
          filteredProfiles.map((profile) => {
            const compatibility = calculateCompatibility(currentUser, profile);
            const isConnected = connectedUserIds.has(profile.id);
            const isRequestSent = sentRequestIds.has(profile.id);
            const isIncoming = incomingRequests.some((r) => r.senderId === profile.id);

            // Determine photo display based on user privacy setting
            const isPhotoVisible =
              profile.photoPrivacy === 'public' ||
              (profile.photoPrivacy === 'blurred_until_accepted' && isConnected);
            const isPhotoBlurred =
              profile.photoPrivacy === 'blurred_until_accepted' && !isConnected;
            const isPhotoLocked = profile.photoPrivacy === 'locked' && !isConnected;

            return (
              <div
                key={profile.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Photo & Privacy Container */}
                  <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={profile.photoUrl}
                      alt={profile.name}
                      className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                        isPhotoBlurred ? 'filter blur-xl scale-110' : ''
                      } ${isPhotoLocked ? 'filter blur-2xl grayscale' : ''}`}
                      referrerPolicy="no-referrer"
                    />

                    {/* Privacy Overlay Message */}
                    {isPhotoBlurred && (
                      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center">
                        <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-1.5 shadow-sm">
                          <EyeOff className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xs font-bold text-white tracking-tight">
                          Photo Protected by Wali
                        </span>
                        <span className="text-[10px] text-slate-200 mt-0.5">
                          Unlocks automatically once connection request is accepted
                        </span>
                      </div>
                    )}

                    {isPhotoLocked && (
                      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center text-white p-4 text-center">
                        <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mb-1.5">
                          <Lock className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-amber-300">
                          Private Family Photo
                        </span>
                        <span className="text-[10px] text-slate-300 mt-0.5">
                          Direct guardian approval required
                        </span>
                      </div>
                    )}

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      {/* Registered By tag */}
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-900/80 backdrop-blur-md text-white shadow-xs">
                        Registered by {profile.registeredBy.toUpperCase()}
                      </span>

                      {/* Compatibility Score */}
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/85 backdrop-blur-md text-emerald-300 border border-emerald-500/30 text-xs font-bold shadow-xs">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span className="tabular-nums">{compatibility.overallPercentage}% Fit</span>
                      </div>
                    </div>

                    {/* Bottom overlay info */}
                    <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-base text-white">
                            {profile.name}
                          </h3>
                          {profile.idVerified && (
                            <span title="NIC Identity Verified">
                              <ShieldCheck className="w-4 h-4 text-emerald-400 fill-emerald-950" />
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-300 font-medium">
                          {profile.age} yrs · {profile.height}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-300 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        <span>{profile.city}, {profile.district} District</span>
                      </div>
                    </div>
                  </div>

                  {/* Profile Details Body */}
                  <div className="p-4 space-y-3">
                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex items-start gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                          {profile.occupation}
                        </span>
                      </div>

                      <div className="flex items-start gap-2">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="text-slate-500 dark:text-slate-400 truncate">
                          {profile.education}
                        </span>
                      </div>
                    </div>

                    {/* Unboxed Personality Traits with typographic separators */}
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-1">
                      {profile.personalityTraits.slice(0, 3).map((trait, idx) => (
                        <React.Fragment key={trait}>
                          <span>{trait}</span>
                          {idx < 2 && <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>}
                        </React.Fragment>
                      ))}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {profile.bio}
                    </p>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800 mt-2 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedProfile(profile)}
                    className="flex-1 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                  >
                    View Bio & Fit
                  </button>

                  {isConnected ? (
                    <button
                      onClick={() => setActiveChatUserId(profile.id)}
                      className="flex-1 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Private Chat</span>
                    </button>
                  ) : isRequestSent ? (
                    <div className="flex-1 py-2 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-center">
                      Request Sent
                    </div>
                  ) : isIncoming ? (
                    <button
                      onClick={() => setShowRequestsDrawer(true)}
                      className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors"
                    >
                      Respond
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (remainingRequests <= 0 && !isUnlimited) {
                          onOpenTierModal();
                        } else {
                          setSendingRequestToProfile(profile);
                        }
                      }}
                      className="flex-1 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>Send Request</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Profile Detail & Compatibility Breakdown Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedProfile.photoUrl}
                  alt={selectedProfile.name}
                  className={`w-16 h-16 rounded-2xl object-cover ${
                    selectedProfile.photoPrivacy === 'blurred_until_accepted' && !connectedUserIds.has(selectedProfile.id)
                      ? 'filter blur-md'
                      : ''
                  }`}
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {selectedProfile.name}
                    </h2>
                    {selectedProfile.idVerified && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        NIC Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {selectedProfile.age} yrs · {selectedProfile.city}, {selectedProfile.district} District
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedProfile(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Compatibility Analysis Card */}
            {(() => {
              const comp = calculateCompatibility(currentUser, selectedProfile);
              return (
                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <h3 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                        Personality & Values Compatibility: {comp.grade}
                      </h3>
                    </div>
                    <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-300 tabular-nums">
                      {comp.overallPercentage}%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {comp.factors.map((f, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-emerald-100 dark:border-slate-700">
                        <div className="flex justify-between items-center text-[11px] font-bold text-slate-800 dark:text-slate-200">
                          <span>{f.title}</span>
                          <span className="text-emerald-600 dark:text-emerald-400 tabular-nums">{f.score}%</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">{f.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Bio & Details */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1.5">
                  About & Family Background
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedProfile.bio}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-400 text-[10px] block">Religious Practice</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedProfile.religiousPractice}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-400 text-[10px] block">Marital Status</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedProfile.maritalStatus}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-400 text-[10px] block">Education</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedProfile.education}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-400 text-[10px] block">Guardian / Chaperone Contact</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {connectedUserIds.has(selectedProfile.id)
                      ? selectedProfile.contactChaperonePhone
                      : 'Visible upon accepted connection'}
                  </span>
                </div>
              </div>

              {/* Safety & Moderation Bar */}
              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setReportingUserId(selectedProfile.id);
                    setSelectedProfile(null);
                  }}
                  className="text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 text-[11px]"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Report or Block Account</span>
                </button>

                <div className="flex items-center gap-2">
                  {!connectedUserIds.has(selectedProfile.id) && !sentRequestIds.has(selectedProfile.id) && (
                    <button
                      onClick={() => {
                        const target = selectedProfile;
                        setSelectedProfile(null);
                        setSendingRequestToProfile(target);
                      }}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold"
                    >
                      Send Connection Request
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Request Confirmation Modal */}
      {sendingRequestToProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-xl">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Send Connection Request to {sendingRequestToProfile.name}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              This will use 1 of your monthly connection requests ({remainingRequests} remaining). 
              If {sendingRequestToProfile.name} accepts, an End-to-End Encrypted chat opens and protected photos will be unblurred.
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Optional Chaperone Introduction Note:
              </label>
              <textarea
                value={requestNoteInput}
                onChange={(e) => setRequestNoteInput(e.target.value)}
                placeholder="Assalamu Alaikum, my family and I reviewed your profile and would appreciate an opportunity to connect for Nikah purposes..."
                className="w-full h-24 p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSendingRequestToProfile(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onSendConnectionRequest(sendingRequestToProfile.id, requestNoteInput);
                  setSendingRequestToProfile(null);
                  setRequestNoteInput('');
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs"
              >
                Confirm & Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connection Requests Drawer (Incoming & Outgoing with SILENT DECLINE) */}
      {showRequestsDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Incoming Match Requests
                </h3>
              </div>
              <button
                onClick={() => setShowRequestsDrawer(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Privacy & Anti-Harassment Notice */}
            <div className="px-5 py-3 bg-amber-50/60 dark:bg-amber-950/30 border-b border-amber-100 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Silent Rejection Protection:</strong> If you decline a request, it is silently and permanently removed. The sender receives zero notification, ensuring your total privacy and dignity.
              </span>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {incomingRequests.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-xs">
                  No pending match requests at this time.
                </div>
              ) : (
                incomingRequests.map((req) => {
                  const sender = profiles.find((p) => p.id === req.senderId);
                  if (!sender) return null;

                  return (
                    <div
                      key={req.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 space-y-3 shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={sender.photoUrl}
                          alt={sender.name}
                          className="w-12 h-12 rounded-xl object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {sender.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate">
                            {sender.age} yrs · {sender.occupation} · {sender.district}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            Sent {req.createdAt}
                          </span>
                        </div>
                      </div>

                      {req.note && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl italic">
                          "{req.note}"
                        </p>
                      )}

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => {
                            onDeclineConnectionRequest(req.id);
                          }}
                          className="flex-1 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
                          title="Silently purge request without alerting sender"
                        >
                          Decline (Silently)
                        </button>

                        <button
                          onClick={() => {
                            onAcceptConnectionRequest(req.id);
                            setActiveChatUserId(sender.id);
                            setShowRequestsDrawer(false);
                          }}
                          className="flex-1 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-xs"
                        >
                          Accept Connection
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-center text-xs text-slate-400">
              Connections allow private E2EE messaging and chaperone oversight.
            </div>
          </div>
        </div>
      )}

      {/* End-to-End Encrypted Private Chat Modal */}
      {activeChatProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full h-[650px] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <img
                  src={activeChatProfile.photoUrl}
                  alt={activeChatProfile.name}
                  className="w-10 h-10 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {activeChatProfile.name}
                    </h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {activeChatProfile.city}, {activeChatProfile.district} · Chaperone Enabled
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsChaperoneModeActive(!isChaperoneModeActive)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors ${
                    isChaperoneModeActive
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                  title="Toggle Chaperone (Wali / Guardian) transparency"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>{isChaperoneModeActive ? 'Wali Chaperone Active' : 'Direct Mode'}</span>
                </button>

                <button
                  onClick={() => setActiveChatUserId(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* E2EE Protocol Status Banner */}
            <div className="px-4 py-2 bg-slate-100 dark:bg-slate-950 text-[10px] text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>End-to-End Encrypted (AES-256-GCM / Curve25519)</span>
              </span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">
                {e2eeSession?.fingerprint}
              </span>
            </div>

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30 dark:bg-slate-950/40">
              <div className="text-center my-2">
                <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-200/50">
                  Connection Accepted · Conversation Chaperoned per Halal Standards
                </span>
              </div>

              {currentConversationMessages.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 space-y-1">
                  <p>Send your respectful greeting to start the conversation.</p>
                  <p className="text-[11px] text-slate-400 italic">"Assalamu Alaikum wa Rahmatullah..."</p>
                </div>
              ) : (
                currentConversationMessages.map((msg) => {
                  const isMine = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-xs ${
                          isMine
                            ? 'bg-emerald-700 text-white rounded-br-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-xs border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <p className="leading-relaxed">{msg.text}</p>
                        <div className="flex items-center justify-end gap-1 mt-1 text-[9px] opacity-75">
                          <Lock className="w-2.5 h-2.5" />
                          <span>{msg.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a respectful message..."
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && chatInputText.trim() && activeConversationId) {
                    onSendMessage(activeConversationId, chatInputText.trim());
                    setChatInputText('');
                  }
                }}
                className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                onClick={() => {
                  if (chatInputText.trim() && activeConversationId) {
                    onSendMessage(activeConversationId, chatInputText.trim());
                    setChatInputText('');
                  }
                }}
                disabled={!chatInputText.trim()}
                className="p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report or Block Modal */}
      {reportingUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Safety & Moderation Action
              </h3>
            </div>

            <p className="text-xs text-slate-500">
              Nikahtent takes community safety and dignity seriously. Reported accounts are reviewed immediately by the compliance team.
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Reason for Report:
              </label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
              >
                <option value="Inappropriate communication">Inappropriate communication</option>
                <option value="Suspected fake profile or details">Suspected fake profile or details</option>
                <option value="Unverified Wali / Guardian details">Unverified Wali / Guardian details</option>
                <option value="Commercial solicitation or spam">Commercial solicitation or spam</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  onBlockUser(reportingUserId);
                  setReportingUserId(null);
                }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700"
              >
                Block Account Immediately
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReportingUserId(null)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onReportUser(reportingUserId, reportReason);
                    setReportingUserId(null);
                  }}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
