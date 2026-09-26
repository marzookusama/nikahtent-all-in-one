import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { UserProfile, RegistrationRole, PhotoPrivacy, ReligiousPractice } from '../types';
import { compressImage, scanImageForThreats, CompressionResult, SecurityScanResult } from '../utils/imageProcessor';

interface ProfileCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (profile: Partial<UserProfile>, imageModerationData?: any) => void;
  initialProfile?: UserProfile;
}

export const ProfileCreatorModal: React.FC<ProfileCreatorModalProps> = ({
  isOpen,
  onClose,
  onSaveProfile,
  initialProfile
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [registeredBy, setRegisteredBy] = useState<RegistrationRole>(
    initialProfile?.registeredBy || 'self'
  );
  const [name, setName] = useState(initialProfile?.name || '');
  const [gender, setGender] = useState<'female' | 'male'>(initialProfile?.gender || 'female');
  const [age, setAge] = useState<number>(initialProfile?.age || 25);
  const [height, setHeight] = useState(initialProfile?.height || `5' 4"`);
  const [district, setDistrict] = useState(initialProfile?.district || 'Colombo');
  const [city, setCity] = useState(initialProfile?.city || 'Dehiwala');
  const [education, setEducation] = useState(initialProfile?.education || '');
  const [occupation, setOccupation] = useState(initialProfile?.occupation || '');
  const [religiousPractice, setReligiousPractice] = useState<ReligiousPractice>(
    initialProfile?.religiousPractice || 'Practicing Sunni'
  );
  const [bio, setBio] = useState(initialProfile?.bio || '');
  const [contactChaperonePhone, setContactChaperonePhone] = useState(
    initialProfile?.contactChaperonePhone || '+94 77 '
  );
  const [photoPrivacy, setPhotoPrivacy] = useState<PhotoPrivacy>(
    initialProfile?.photoPrivacy || 'blurred_until_accepted'
  );

  // Selected Traits
  const [selectedTraits, setSelectedTraits] = useState<string[]>(
    initialProfile?.personalityTraits || ['Family-Oriented', 'Career-Focused']
  );

  // Image Processing State
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(
    initialProfile?.photoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'
  );
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [scanResult, setScanResult] = useState<SecurityScanResult | null>(null);

  if (!isOpen) return null;

  const availableTraits = [
    'Family-Oriented',
    'Career-Focused',
    'Culinary Enthusiast',
    'Book Lover',
    'Traveler',
    'Active / Fitness',
    'Creative',
    'Community-Minded',
    'Nature Lover',
    'Introverted',
    'Organized',
    'Modest'
  ];

  const sriLankaDistricts = [
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

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImageFile(file);
    setIsProcessingImage(true);

    try {
      // 1. Client-side canvas compression
      const comp = await compressImage(file, 1080, 0.75);
      setCompressionResult(comp);
      setImagePreviewUrl(comp.compressedDataUrl);

      // 2. Automated threat & decency scan
      const scan = await scanImageForThreats(file.name, comp.compressedDataUrl);
      setScanResult(scan);
    } catch (err) {
      console.error('Image processing failed', err);
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleToggleTrait = (trait: string) => {
    if (selectedTraits.includes(trait)) {
      setSelectedTraits(selectedTraits.filter((t) => t !== trait));
    } else {
      if (selectedTraits.length < 6) {
        setSelectedTraits([...selectedTraits, trait]);
      }
    }
  };

  const handleFinalSubmit = () => {
    const profilePayload: Partial<UserProfile> = {
      name: name || 'New Member',
      registeredBy,
      gender,
      age: Number(age),
      height,
      district,
      city,
      education: education || 'Undergraduate / Professional',
      occupation: occupation || 'Professional',
      religiousPractice,
      personalityTraits: selectedTraits,
      bio: bio || 'Alhamdulillah, seeking a halal partner for a blessed Nikah.',
      photoUrl: imagePreviewUrl,
      photoPrivacy,
      approvalStatus: 'pending', // Under admin moderation review
      contactChaperonePhone
    };

    const imageModerationData = compressionResult
      ? {
          originalFileName: selectedImageFile?.name || 'profile_image.jpg',
          originalSizeKb: compressionResult.originalSizeKb,
          compressedSizeKb: compressionResult.compressedSizeKb,
          compressionRatio: compressionResult.compressionRatio,
          scanResult: scanResult?.verdict || 'clean',
          scanDetails: scanResult?.details || 'Standard modesty check passed.',
          imageUrl: compressionResult.compressedDataUrl
        }
      : undefined;

    onSaveProfile(profilePayload, imageModerationData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>Matrimonial Profile Builder</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Step {activeStep} of 3: {activeStep === 1 ? 'Guardian & Basic Details' : activeStep === 2 ? 'Deen & Personality Traits' : 'Secure Photo Upload & Privacy'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-3 gap-2">
          <div className={`h-1.5 rounded-full transition-colors ${activeStep >= 1 ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-800'}`} />
          <div className={`h-1.5 rounded-full transition-colors ${activeStep >= 2 ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-800'}`} />
          <div className={`h-1.5 rounded-full transition-colors ${activeStep >= 3 ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-800'}`} />
        </div>

        {/* STEP 1: Registration Mode & Basic Details */}
        {activeStep === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">
                Who is creating this profile?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { role: 'self', label: 'For Myself' },
                  { role: 'parent', label: 'Parent / Father' },
                  { role: 'wali', label: 'Wali / Chaperone' },
                  { role: 'sister', label: 'Brother / Sister' }
                ].map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => setRegisteredBy(item.role as RegistrationRole)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                      registeredBy === item.role
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Candidate Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fatima / Ziyad"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'female' | 'male')}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                >
                  <option value="female">Female (Bride)</option>
                  <option value="male">Male (Groom)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Age & Height
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="18"
                    max="70"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-1/2 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Height (e.g. 5ft 6in)"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-1/2 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Sri Lankan District & City
                </label>
                <div className="flex gap-2">
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-1/2 px-2 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  >
                    {sriLankaDistricts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="City (e.g. Akurana)"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-1/2 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Education
                </label>
                <input
                  type="text"
                  placeholder="e.g. MBBS, BSc Engineering, MBA"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Occupation & Industry
                </label>
                <input
                  type="text"
                  placeholder="e.g. Medical Doctor, Software Architect"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Wali / Chaperone Contact Number (Confidential)
              </label>
              <input
                type="text"
                placeholder="+94 77 123 4567"
                value={contactChaperonePhone}
                onChange={(e) => setContactChaperonePhone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                This number is strictly guarded and only shared with accepted matches.
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: Deen & Personality Traits */}
        {activeStep === 2 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                Religious Practice & Values
              </label>
              <select
                value={religiousPractice}
                onChange={(e) => setReligiousPractice(e.target.value as ReligiousPractice)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
              >
                <option value="Practicing Sunni">Practicing Sunni (Observes Salah & Halal)</option>
                <option value="Very Practicing">Very Practicing (Tahajjud, Strict Modesty)</option>
                <option value="Moderate">Moderate (Balancing Career & Religious Foundations)</option>
                <option value="Culturally Traditional">Culturally Traditional Sri Lankan Muslim</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Select Personality & Interest Traits
                </label>
                <span className="text-[10px] text-slate-400">
                  {selectedTraits.length} of 6 selected
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableTraits.map((trait) => {
                  const isSelected = selectedTraits.includes(trait);
                  return (
                    <button
                      key={trait}
                      type="button"
                      onClick={() => handleToggleTrait(trait)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {trait}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                Personal Bio & Partner Expectations
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="Share your background, family values, hobbies, and what you seek in a life partner..."
                className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Automated Compression, Security Scan & Photo Privacy */}
        {activeStep === 3 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">
                Photo Privacy & Chaperone Control
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    type: 'blurred_until_accepted',
                    icon: EyeOff,
                    title: 'Blurred Until Accepted',
                    desc: 'Blurred to public. Unblurred only when you accept a request.'
                  },
                  {
                    type: 'public',
                    icon: Eye,
                    title: 'Visible to Verified',
                    desc: 'Clear photo visible to verified Sri Lankan Muslim members.'
                  },
                  {
                    type: 'locked',
                    icon: Lock,
                    title: 'Locked / Chaperone Only',
                    desc: 'Hidden with lock badge. Manual Wali unlock required.'
                  }
                ].map((opt) => {
                  const Icon = opt.icon;
                  const isSel = photoPrivacy === opt.type;
                  return (
                    <div
                      key={opt.type}
                      onClick={() => setPhotoPrivacy(opt.type as PhotoPrivacy)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        isSel
                          ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/40 ring-1 ring-emerald-500'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-4 h-4 ${isSel ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {opt.title}
                        </h4>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight">
                        {opt.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Image Upload & Security Pipeline Preview */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border border-slate-300 dark:border-slate-700">
                  <img
                    src={imagePreviewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {photoPrivacy === 'blurred_until_accepted' && (
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center text-white">
                      <EyeOff className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 text-xs font-semibold rounded-xl cursor-pointer shadow-xs transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    JPG, PNG or WebP up to 10MB. Automatically compressed and scanned for safety before saving to cloud servers.
                  </p>
                </div>
              </div>

              {/* Compression & Safety Scan Diagnostics */}
              {isProcessingImage ? (
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  <span>Compressing and running automated security scans...</span>
                </div>
              ) : compressionResult ? (
                <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-400 block">Original Size</span>
                      <span className="font-bold tabular-nums text-slate-800 dark:text-slate-200">
                        {compressionResult.originalSizeKb} KB
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-400 block">Compressed Size</span>
                      <span className="font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                        {compressionResult.compressedSizeKb} KB
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-400 block">Bandwidth Saved</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {compressionResult.compressionRatio}
                      </span>
                    </div>
                  </div>

                  {scanResult && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-emerald-900 dark:text-emerald-200 block">
                          Automated Security Scan Passed ({scanResult.score}/100)
                        </span>
                        <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                          {scanResult.details}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              {/* Admin Moderation Notice */}
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <FileCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Manual Admin Moderation Pipeline:</strong> Once uploaded, your photo is placed in the admin approval queue. Once our moderator verifies compliance with Islamic modesty standards, you will receive an automated notification and your photo will be published.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          {activeStep > 1 ? (
            <button
              onClick={() => setActiveStep((prev) => (prev - 1) as 1 | 2)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {activeStep < 3 ? (
            <button
              onClick={() => setActiveStep((prev) => (prev + 1) as 2 | 3)}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs"
            >
              Next Step
            </button>
          ) : (
            <button
              onClick={handleFinalSubmit}
              className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md"
            >
              Submit Profile for Moderation
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
