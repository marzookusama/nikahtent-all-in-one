import {
  UserProfile,
  VendorListing,
  SubscriptionPlanConfig,
  ImageModerationItem,
  UserActivityLog,
  SystemNotification
} from '../types';

export const CURRENT_USER: UserProfile = {
  id: 'usr_me_01',
  name: 'Ziyad Marzook',
  registeredBy: 'self',
  gender: 'male',
  age: 28,
  height: `5' 10"`,
  district: 'Colombo',
  city: 'Dehiwala',
  education: 'BSc in Software Engineering, Moratuwa / MSc London',
  occupation: 'Senior Solutions Architect',
  employerOrField: 'Fintech Enterprise Colombo',
  religiousPractice: 'Practicing Sunni',
  personalityTraits: [
    'Family-Oriented',
    'Career-Focused',
    'Traveler',
    'Book Lover',
    'Active / Fitness',
    'Culinary Enthusiast'
  ],
  values: ['Honesty', 'Islamic Ethics', 'Mutual Respect', 'Community Service'],
  bio: 'Alhamdulillah, balancing Islamic values with a fulfilling career in technology. Enjoy weekend cricket, reading Islamic history, and exploring coastal Sri Lanka. Seeking a pious, kind-hearted partner with shared values for a halal blessed marriage.',
  photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  photoPrivacy: 'public',
  idVerified: true,
  approvalStatus: 'approved',
  tier: 'free',
  monthlyRequestsUsed: 1,
  monthlyRequestsLimit: 3,
  contactChaperonePhone: '+94 77 123 4567',
  languages: ['English', 'Tamil', 'Sinhala'],
  maritalStatus: 'Never Married',
  smokingHabit: 'Non-Smoker',
  dietaryPreference: 'Strict Halal'
};

export const SEED_PROFILES: UserProfile[] = [
  {
    id: 'usr_02',
    name: 'Fatima Razeen',
    registeredBy: 'parent',
    gender: 'female',
    age: 25,
    height: `5' 4"`,
    district: 'Colombo',
    city: 'Wellawatte',
    education: 'MBBS (Doctor) - University of Colombo',
    occupation: 'Medical Doctor (House Officer)',
    employerOrField: 'National Hospital of Sri Lanka',
    religiousPractice: 'Practicing Sunni',
    personalityTraits: [
      'Family-Oriented',
      'Compassionate',
      'Career-Focused',
      'Book Lover',
      'Creative'
    ],
    values: ['Modesty', 'Family Harmony', 'Deen Priority', 'Empathy'],
    bio: 'Profile created by parents. Fatima is a compassionate medical doctor who observes hijab and regular prayers. She is grounded in cultural values, enjoys baking, and values close family ties. Looking for an educated, pious groom settled in Sri Lanka or overseas.',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    photoPrivacy: 'blurred_until_accepted',
    idVerified: true,
    approvalStatus: 'approved',
    tier: 'gold',
    monthlyRequestsUsed: 0,
    monthlyRequestsLimit: 35,
    contactChaperonePhone: '+94 71 892 1102 (Father)',
    languages: ['English', 'Tamil'],
    maritalStatus: 'Never Married',
    smokingHabit: 'Non-Smoker',
    dietaryPreference: 'Strict Halal'
  },
  {
    id: 'usr_03',
    name: 'Amina Cassim',
    registeredBy: 'self',
    gender: 'female',
    age: 26,
    height: `5' 5"`,
    district: 'Kandy',
    city: 'Akurana',
    education: 'ACCA Member & BBA in Finance',
    occupation: 'Senior Financial Analyst',
    employerOrField: 'Multinational Advisory Firm',
    religiousPractice: 'Practicing Sunni',
    personalityTraits: [
      'Active / Fitness',
      'Family-Oriented',
      'Culinary Enthusiast',
      'Traveler',
      'Organized'
    ],
    values: ['Islamic Principles', 'Continuous Learning', 'Kindness', 'Generosity'],
    bio: 'Based in scenic Akurana, working remotely with frequent visits to Colombo. I value continuous learning, modest lifestyle, and spending quality time with family. Enjoy making traditional sweets and exploring tea country hiking trails.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    photoPrivacy: 'public',
    idVerified: true,
    approvalStatus: 'approved',
    tier: 'silver',
    monthlyRequestsUsed: 4,
    monthlyRequestsLimit: 15,
    contactChaperonePhone: '+94 81 223 9988',
    languages: ['English', 'Tamil', 'Sinhala'],
    maritalStatus: 'Never Married',
    smokingHabit: 'Non-Smoker',
    dietaryPreference: 'Halal Only'
  },
  {
    id: 'usr_04',
    name: 'Mariam Hameed',
    registeredBy: 'wali',
    gender: 'female',
    age: 27,
    height: `5' 3"`,
    district: 'Galle',
    city: 'Galle Fort / Dangedara',
    education: 'BA in English Literature & Graphic Design',
    occupation: 'Creative Director & Educator',
    employerOrField: 'International School Galle',
    religiousPractice: 'Moderate',
    personalityTraits: [
      'Creative',
      'Nature Lover',
      'Family-Oriented',
      'Book Lover',
      'Introverted'
    ],
    values: ['Artistic Expression', 'Modesty', 'Warm Hospitality', 'Integrity'],
    bio: 'Managed on behalf of Mariam by her elder brother. Warm, mild-tempered, and deeply cultured in Galle traditions. Passionate about art, Islamic calligraphy, and literature. Seeking a kind, respectful gentleman with sound character.',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    photoPrivacy: 'blurred_until_accepted',
    idVerified: true,
    approvalStatus: 'approved',
    tier: 'free',
    monthlyRequestsUsed: 2,
    monthlyRequestsLimit: 3,
    contactChaperonePhone: '+94 91 224 5560 (Brother)',
    languages: ['English', 'Tamil', 'Sinhala'],
    maritalStatus: 'Never Married',
    smokingHabit: 'Non-Smoker',
    dietaryPreference: 'Strict Halal'
  },
  {
    id: 'usr_05',
    name: 'Rifka Nizar',
    registeredBy: 'sister',
    gender: 'female',
    age: 29,
    height: `5' 6"`,
    district: 'Ampara',
    city: 'Kalmunai',
    education: 'BSc in Agriculture & Food Technology',
    occupation: 'Quality Assurance Executive',
    employerOrField: 'Agri Export Board',
    religiousPractice: 'Practicing Sunni',
    personalityTraits: [
      'Family-Oriented',
      'Culinary Enthusiast',
      'Helpful',
      'Community-Minded'
    ],
    values: ['Charity', 'Simplicity', 'Islamic Etiquette', 'Patience'],
    bio: 'Registered by her married elder sister. Rifka is calm, soft-spoken, and dependable with deep respect for elders. Known for her hospitality and culinary talents. Looking for an understanding partner willing to build a peaceful household.',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    photoPrivacy: 'locked',
    idVerified: true,
    approvalStatus: 'approved',
    tier: 'free',
    monthlyRequestsUsed: 1,
    monthlyRequestsLimit: 3,
    contactChaperonePhone: '+94 67 222 4321',
    languages: ['Tamil', 'English'],
    maritalStatus: 'Never Married',
    smokingHabit: 'Non-Smoker',
    dietaryPreference: 'Strict Halal'
  },
  {
    id: 'usr_06',
    name: 'Irfan Farook',
    registeredBy: 'self',
    gender: 'male',
    age: 30,
    height: `5' 11"`,
    district: 'Colombo',
    city: 'Bambalapitiya',
    education: 'Chartered Accountant (ICASL) & BCom',
    occupation: 'Finance Manager',
    employerOrField: 'Conglomerate Group PLC',
    religiousPractice: 'Practicing Sunni',
    personalityTraits: [
      'Career-Focused',
      'Family-Oriented',
      'Sports Enthusiast',
      'Organized'
    ],
    values: ['Faith', 'Responsibility', 'Respect', 'Generosity'],
    bio: 'Grew up in Colombo, deeply committed to professional growth and Islamic foundations. Enjoys badminton, reading, and charitable projects. Looking for an educated, understanding partner with mutual respect.',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    photoPrivacy: 'public',
    idVerified: true,
    approvalStatus: 'approved',
    tier: 'platinum',
    monthlyRequestsUsed: 8,
    monthlyRequestsLimit: 999,
    contactChaperonePhone: '+94 77 998 7766',
    languages: ['English', 'Tamil', 'Sinhala'],
    maritalStatus: 'Never Married',
    smokingHabit: 'Non-Smoker',
    dietaryPreference: 'Strict Halal'
  }
];

export const SEED_VENDORS: VendorListing[] = [
  {
    id: 'vnd_01',
    name: 'Farzana Rafeek',
    businessName: "Farzana's Bridal Henna & Glamour",
    category: 'beautician',
    district: 'Colombo',
    address: 'Duplication Road, Colombo 03',
    rating: 4.9,
    reviewCount: 48,
    startingPriceLKR: 45000,
    priceUnit: 'per bridal package',
    portfolioImages: [
      '/src/assets/images/vendor_bridal_beautician_1790450002054.jpg',
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&auto=format&fit=crop&q=80'
    ],
    packages: [
      {
        id: 'pkg_b1',
        title: 'Essential Nikah Glam',
        priceLKR: 45000,
        features: ['HD Modest Bridal Makeup', 'Hijab Styling & Pinning', 'Hand Mehndi (Front & Back)', 'Touch-up Kit']
      },
      {
        id: 'pkg_b2',
        title: 'Grand Walima Signature',
        priceLKR: 85000,
        features: ['Airbrush Makeup', 'Intricate Rajasthani / Arabic Mehndi to Elbow', 'Dupatta & Hijab Crown Setting', 'Trial Session Included', 'Mother & Sister Makeup']
      }
    ],
    isVerified: true,
    subscriptionStatus: 'trial_active',
    trialDaysLeft: 52,
    description: 'Premier Colombo bridal studio specializing in modest Muslim bridal aesthetics, bespoke hijab drapery, and certified chemical-free organic henna.',
    contactPhone: '+94 77 345 8899',
    whatsapp: '+94773458899',
    reviews: [
      {
        id: 'rev_1',
        author: 'Sumayya N.',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Farzana made me look and feel like royalty on my Nikah day! Her hijab draping stayed flawless for 8 hours.'
      },
      {
        id: 'rev_2',
        author: 'Ayesha K.',
        rating: 5,
        date: '1 month ago',
        comment: 'The organic henna color was dark mahogany and so neat. Booked via Nikahtent without any hassle.'
      }
    ],
    ownerId: 'usr_vnd_01'
  },
  {
    id: 'vnd_02',
    name: 'Al-Mubarak Events',
    businessName: 'Al-Mubarak Royal Dum Buriyani & Walima Caterers',
    category: 'catering',
    district: 'Colombo',
    address: 'Baseline Road, Dematagoda, Colombo 09',
    rating: 4.8,
    reviewCount: 92,
    startingPriceLKR: 2850,
    priceUnit: 'per plate',
    portfolioImages: [
      '/src/assets/images/vendor_wedding_buriyani_1790450027785.jpg',
      'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=500&auto=format&fit=crop&q=80'
    ],
    packages: [
      {
        id: 'pkg_c1',
        title: 'Traditional Walima Feast',
        priceLKR: 2850,
        features: ['Basmati Chicken Dum Buriyani', 'Egg & Fried Cashews', 'Galle Malay Pickle', 'Brinjal Pahi', 'Mint Chutney', 'Traditional Watalappam & Ice Cream']
      },
      {
        id: 'pkg_c2',
        title: 'Mughal Imperial Banquet',
        priceLKR: 3950,
        features: ['Mutton & Chicken Dum Buriyani', 'Fried Seer Fish Cutlets', 'Tandoori Roast Chicken', 'Cashew Curry & Dhal', 'Creamy Faluda Bar', 'Cardamom Tea Station']
      }
    ],
    isVerified: true,
    subscriptionStatus: 'subscribed',
    trialDaysLeft: 0,
    description: 'Serving authentic firewood Dum Buriyani for Sri Lankan Muslim weddings for over 25 years. Certified 100% Halal kitchen with professional silver service staff.',
    contactPhone: '+94 11 268 7788',
    whatsapp: '+94712687788',
    reviews: [
      {
        id: 'rev_3',
        author: 'Mohamed Rizwan',
        rating: 5,
        date: '3 weeks ago',
        comment: 'All 400 guests praised the Buriyani taste and the warm Watalappam. Punctual delivery to the hall!'
      }
    ],
    ownerId: 'usr_vnd_02'
  },
  {
    id: 'vnd_03',
    name: 'Serendib Canopy & Stage',
    businessName: 'Serendib Grand Marquee & Luxury Wedding Stages',
    category: 'stage_decor',
    district: 'Kandy',
    address: 'Katugastota Road, Kandy',
    rating: 4.9,
    reviewCount: 37,
    startingPriceLKR: 120000,
    priceUnit: 'per setup',
    portfolioImages: [
      '/src/assets/images/vendor_stage_tents_1790450015435.jpg',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&auto=format&fit=crop&q=80'
    ],
    packages: [
      {
        id: 'pkg_s1',
        title: 'Elegance Nikah Backdrop',
        priceLKR: 120000,
        features: ['Floral Arch with Fresh Roses & Jasmine', 'Royal Velvet Setee Sofa', 'LED Warm Uplighting', 'Carpeted Stage Platform']
      },
      {
        id: 'pkg_s2',
        title: 'Complete Outdoor Tent & Stage Pavilion',
        priceLKR: 280000,
        features: ['Weatherproof Silk Draped Marquee Tent (500 pax)', '250 Golden Chiavari Chairs with Cushions', 'Crystal Chandeliers & Fairy Ceiling', 'Buffet Canopies & Entrance Walkway Arch']
      }
    ],
    isVerified: true,
    subscriptionStatus: 'trial_active',
    trialDaysLeft: 46,
    description: 'Transforming indoor halls and private gardens across Kandy, Matale, and Kurunegala into royal wedding pavilions. Heavy duty waterproof marquees and designer stage decor.',
    contactPhone: '+94 81 445 6789',
    whatsapp: '+94814456789',
    reviews: [
      {
        id: 'rev_4',
        author: 'Faheem & Nabila',
        rating: 5,
        date: 'Last month',
        comment: 'The lighting was magical. Even with evening rain in Kandy, the marquee tent kept everyone completely dry and comfortable.'
      }
    ],
    ownerId: 'usr_vnd_03'
  },
  {
    id: 'vnd_04',
    name: 'Lanka Nikah Cinematics',
    businessName: 'Lanka Nikah Cinematics & Candid Photography',
    category: 'photo_shooter',
    district: 'Colombo',
    address: 'Havelock Road, Colombo 05',
    rating: 5.0,
    reviewCount: 54,
    startingPriceLKR: 95000,
    priceUnit: 'per event',
    portfolioImages: [
      '/src/assets/images/vendor_photo_shooter_1790450039025.jpg',
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=500&auto=format&fit=crop&q=80'
    ],
    packages: [
      {
        id: 'pkg_p1',
        title: 'Nikah Signature Coverage',
        priceLKR: 95000,
        features: ['2 Senior Photographers (Female photographer available)', 'Full Ceremony & Family Portraits', '350+ Retouched Digital Photos', 'Luxury Leather Bound Album (40 Pages)']
      },
      {
        id: 'pkg_p2',
        title: 'Royal Two-Day Cinematic Story',
        priceLKR: 185000,
        features: ['Nikah & Walima 4K Cinematic Highlights Film (5 mins)', 'Full Length Documentary Video', 'Drone Aerial Footage of Hall / Garden', '2 Photographers + 2 Cinematographers', 'Separate female crew for bride modesty']
      }
    ],
    isVerified: true,
    subscriptionStatus: 'trial_active',
    trialDaysLeft: 58,
    description: 'Specialists in Muslim wedding photography with strict respect for pardah/modesty guidelines. We offer all-female photographer and editor teams on request.',
    contactPhone: '+94 77 889 0011',
    whatsapp: '+94778890011',
    reviews: [
      {
        id: 'rev_5',
        author: 'Dr. Ilham S.',
        rating: 5,
        date: '1 week ago',
        comment: 'Their female crew for the bride room was so professional and respectful. The cinematic video brought tears to our families.'
      }
    ],
    ownerId: 'usr_vnd_04'
  },
  {
    id: 'vnd_05',
    name: 'Chef Rameez Walima Master',
    businessName: 'Chef Rameez Private Wedding Banquet',
    category: 'chef',
    district: 'Galle',
    address: 'Talpe / Galle Road',
    rating: 4.9,
    reviewCount: 29,
    startingPriceLKR: 75000,
    priceUnit: 'chef booking fee',
    portfolioImages: [
      '/src/assets/images/vendor_wedding_buriyani_1790450027785.jpg',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80'
    ],
    packages: [
      {
        id: 'pkg_ch1',
        title: 'On-Site Master Chef Live Cooking',
        priceLKR: 75000,
        features: ['Live Dum Pot Opening Ceremony', 'Signature Spice Blends', 'Supervision of 15 Kitchen Staff', 'Tasting Consultation Before Wedding']
      }
    ],
    isVerified: true,
    subscriptionStatus: 'trial_active',
    trialDaysLeft: 38,
    description: 'Renowned executive chef with 18 years in Gulf 5-star hotels, now offering on-site master culinary curation for high-profile Sri Lankan Muslim weddings.',
    contactPhone: '+94 91 334 2211',
    whatsapp: '+94913342211',
    reviews: [
      {
        id: 'rev_6',
        author: 'Zahran M.',
        rating: 5,
        date: '2 months ago',
        comment: 'Chef Rameez took our Walima feast to a level unseen before in Southern Province!'
      }
    ],
    ownerId: 'usr_vnd_05'
  },
  {
    id: 'vnd_06',
    name: 'Al-Baraka Tent & Sound Rentals',
    businessName: 'Al-Baraka Tent, Stage & Banquet Furniture',
    category: 'tent_chairs',
    district: 'Colombo',
    address: 'Grandpass, Colombo 14',
    rating: 4.7,
    reviewCount: 41,
    startingPriceLKR: 45000,
    priceUnit: 'rental base package',
    portfolioImages: [
      '/src/assets/images/vendor_stage_tents_1790450015435.jpg'
    ],
    packages: [
      {
        id: 'pkg_t1',
        title: 'Banquet Seating Package (200 Pax)',
        priceLKR: 45000,
        features: ['200 Cushioned Banquet Chairs with White Covers & Gold Bows', '20 Round Tables with Satin Cloths', 'Setup & Breakdown Logistics in Colombo']
      },
      {
        id: 'pkg_t2',
        title: 'Heavy Duty A-Frame Tent Setup',
        priceLKR: 95000,
        features: ['40ft x 60ft High-Peak Waterproof Tent', 'Ceiling Fan Installations & Warm Fairy Lights', 'Side Wall Enclosures for Weather Protection']
      }
    ],
    isVerified: true,
    subscriptionStatus: 'trial_active',
    trialDaysLeft: 42,
    description: 'Dependable wedding logistics with over 2,000 chairs, luxury round tables, waterproof marquee tents, and generator backups.',
    contactPhone: '+94 11 243 1199',
    whatsapp: '+94112431199',
    reviews: [],
    ownerId: 'usr_vnd_06'
  }
];

export const INITIAL_SUBSCRIPTION_PLANS: SubscriptionPlanConfig[] = [
  {
    id: 'sub_free',
    code: 'free',
    name: 'Basic Halal Tier',
    targetType: 'matrimony',
    priceMonthlyLKR: 0,
    priceYearlyLKR: 0,
    requestLimit: 3,
    features: [
      '3 Connection Requests per month',
      'Personality Compatibility Scores',
      'End-to-End Encrypted Private Chat',
      'Photo Privacy Protection (Blurred/Lock)',
      'Basic Search & District Filters'
    ],
    isActive: true
  },
  {
    id: 'sub_silver',
    code: 'silver',
    name: 'Silver Mubarak',
    targetType: 'matrimony',
    priceMonthlyLKR: 3500,
    priceYearlyLKR: 28000,
    requestLimit: 15,
    features: [
      '15 Connection Requests per month',
      'Direct Chaperone / Wali Contact Access',
      'Detailed Personality Dimension Breakdown',
      'Priority Matching Algorithm Placement',
      'Verified ID Priority Badge'
    ],
    isActive: true,
    badgeText: 'Popular'
  },
  {
    id: 'sub_gold',
    code: 'gold',
    name: 'Gold Barakah',
    targetType: 'matrimony',
    priceMonthlyLKR: 6500,
    priceYearlyLKR: 52000,
    requestLimit: 35,
    features: [
      '35 Connection Requests per month',
      'Read Receipts on Encrypted Messages',
      'Dedicated Matchmaking Advisor Session',
      'Profile Spotlight to 5,000+ Active Members',
      'Unlimited Profile Photo Viewing Unlocks'
    ],
    isActive: true,
    badgeText: 'Best Value'
  },
  {
    id: 'sub_platinum',
    code: 'platinum',
    name: 'Platinum Royal',
    targetType: 'matrimony',
    priceMonthlyLKR: 12000,
    priceYearlyLKR: 96000,
    requestLimit: 'unlimited',
    features: [
      'Unlimited Connection Requests per month',
      'Top-Tier Profile Boost in Match Feeds',
      'Personal Nikah Relationship Chaperone',
      'Exclusive 15% Discount on Nikahtent Wedding Vendors',
      '24/7 Priority Support & Relationship Counselor'
    ],
    isActive: true,
    badgeText: 'VIP'
  },
  {
    id: 'sub_vnd_starter',
    code: 'vendor_standard',
    name: 'Vendor Standard Listing',
    targetType: 'vendor',
    priceMonthlyLKR: 5000,
    priceYearlyLKR: 45000,
    requestLimit: 'unlimited',
    features: [
      '2 Months Free Initial Trial Period',
      'Full Portfolio Showcase & Packages',
      'Direct Client Booking Request Inbox',
      'Client Verified Ratings & Reviews',
      'WhatsApp & Phone Lead Generation'
    ],
    isActive: true
  },
  {
    id: 'sub_vnd_featured',
    code: 'vendor_featured',
    name: 'Vendor Premier Spotlight',
    targetType: 'vendor',
    priceMonthlyLKR: 11000,
    priceYearlyLKR: 99000,
    requestLimit: 'unlimited',
    features: [
      'Top of Search Category Pinning',
      'Gold Verified Service Badge',
      'Direct Lead Push Alerts on WhatsApp',
      'Promoted on Matrimony Member Match Unlocks',
      'Analytics Dashboard for Profile Views'
    ],
    isActive: true,
    badgeText: 'Vendor Choice'
  }
];

export const INITIAL_IMAGE_MODERATION: ImageModerationItem[] = [
  {
    id: 'mod_01',
    userId: 'usr_me_01',
    userName: 'Ziyad Marzook',
    originalFileName: 'ziyad_portrait_dslr_raw.jpg',
    originalSizeKb: 3420,
    compressedSizeKb: 284,
    compressionRatio: '92% reduction',
    scanResult: 'clean',
    scanDetails: 'Passed modesty orientation, EXIF safe, 0 payload signatures.',
    status: 'approved',
    uploadedAt: '2 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'mod_02',
    userId: 'usr_02',
    userName: 'Fatima Razeen',
    originalFileName: 'fatima_headshot_colombo.png',
    originalSizeKb: 2150,
    compressedSizeKb: 198,
    compressionRatio: '91% reduction',
    scanResult: 'clean',
    scanDetails: 'Clean portrait, privacy set to blurred-until-accepted.',
    status: 'approved',
    uploadedAt: '1 day ago',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'mod_03',
    userId: 'usr_07_new',
    userName: 'Akram Shafi (Kurunegala)',
    originalFileName: 'profile_pic_akram_2026.jpg',
    originalSizeKb: 4890,
    compressedSizeKb: 312,
    compressionRatio: '94% reduction',
    scanResult: 'clean',
    scanDetails: 'Automated heuristics clean. Awaiting manual admin confirmation before public render.',
    status: 'pending',
    uploadedAt: '15 mins ago',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'mod_04',
    userId: 'usr_08_test',
    userName: 'Anonymous Candidate',
    originalFileName: 'scanned_document_graphic.png',
    originalSizeKb: 1800,
    compressedSizeKb: 160,
    compressionRatio: '91% reduction',
    scanResult: 'flagged',
    scanDetails: 'Image contains non-human graphic / cartoon avatar contrary to authentic verification policy.',
    status: 'pending',
    uploadedAt: '35 mins ago',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_ACTIVITY_LOGS: UserActivityLog[] = [
  {
    id: 'act_01',
    userId: 'usr_me_01',
    userName: 'Ziyad Marzook',
    action: 'Connection Request Dispatched',
    details: 'Dispatched monthly request 1 of 3 to Fatima Razeen (Doctor, Colombo)',
    timestamp: '2 hours ago',
    ipOrLocation: 'Colombo, Western Province',
    category: 'request'
  },
  {
    id: 'act_02',
    userId: 'usr_vnd_01',
    userName: "Farzana's Bridal Henna",
    action: 'Vendor Booking Inquiry Received',
    details: 'New inquiry for Grand Walima Signature package on Dec 14, 2026',
    timestamp: '3 hours ago',
    ipOrLocation: 'Colombo 03',
    category: 'booking'
  },
  {
    id: 'act_03',
    userId: 'usr_06',
    userName: 'Irfan Farook',
    action: 'Subscription Upgrade',
    details: 'Upgraded from Silver to Platinum Royal (LKR 12,000 / month)',
    timestamp: '5 hours ago',
    ipOrLocation: 'Bambalapitiya, Colombo',
    category: 'subscription'
  },
  {
    id: 'act_04',
    userId: 'admin_sys',
    userName: 'Compliance Team',
    action: 'NIC Identity Verified',
    details: 'Verified national identity card for Fatima Razeen (SLMC Registered)',
    timestamp: '1 day ago',
    ipOrLocation: 'Admin Portal (HQ)',
    category: 'moderation'
  }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif_01',
    userId: 'usr_me_01',
    title: 'Profile Photo Approved',
    message: 'Your profile photo has passed automated security scan and admin review. It is now live with your chosen privacy setting.',
    timestamp: '2 hours ago',
    isRead: false,
    type: 'image_status'
  },
  {
    id: 'notif_02',
    userId: 'usr_me_01',
    title: 'Monthly Quota Alert',
    message: 'You have 2 of 3 free monthly connection requests remaining. Upgrade to Silver or Gold for increased limits.',
    timestamp: '1 day ago',
    isRead: true,
    type: 'subscription_alert'
  }
];
