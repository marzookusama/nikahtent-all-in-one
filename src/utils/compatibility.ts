import { UserProfile } from '../types';

export interface CompatibilityScore {
  overallPercentage: number;
  grade: 'Exceptional' | 'High Compatibility' | 'Good Match' | 'Moderate Compatibility';
  factors: {
    title: string;
    score: number; // 0 to 100
    description: string;
  }[];
}

/**
 * Calculates personality and value compatibility between two profiles.
 */
export function calculateCompatibility(
  userA: UserProfile,
  userB: UserProfile
): CompatibilityScore {
  // 1. Personality Traits overlap (35% weight)
  const sharedTraits = userA.personalityTraits.filter((t) =>
    userB.personalityTraits.includes(t)
  );
  const totalDistinctTraits = new Set([
    ...userA.personalityTraits,
    ...userB.personalityTraits
  ]).size;
  const personalityScore = Math.min(
    100,
    Math.round(((sharedTraits.length * 2) / (totalDistinctTraits || 1)) * 100) + 20
  );

  // 2. Religious practice alignment (30% weight)
  let religiousScore = 75;
  if (userA.religiousPractice === userB.religiousPractice) {
    religiousScore = 100;
  } else if (
    (userA.religiousPractice === 'Practicing Sunni' && userB.religiousPractice === 'Moderate') ||
    (userA.religiousPractice === 'Moderate' && userB.religiousPractice === 'Practicing Sunni')
  ) {
    religiousScore = 88;
  } else {
    religiousScore = 70;
  }

  // 3. Cultural & District Proximity (20% weight)
  let locationScore = 65;
  if (userA.district === userB.district) {
    locationScore = 100;
  } else {
    // Western Province cluster
    const westernProvince = ['Colombo', 'Gampaha', 'Kalutara'];
    const centralProvince = ['Kandy', 'Matale', 'Nuwara Eliya'];
    const easternProvince = ['Ampara', 'Batticaloa', 'Trincomalee'];

    if (
      (westernProvince.includes(userA.district) && westernProvince.includes(userB.district)) ||
      (centralProvince.includes(userA.district) && centralProvince.includes(userB.district)) ||
      (easternProvince.includes(userA.district) && easternProvince.includes(userB.district))
    ) {
      locationScore = 90;
    } else {
      locationScore = 75;
    }
  }

  // 4. Life goals & dietary/habits compatibility (15% weight)
  let lifestyleScore = 80;
  if (userA.smokingHabit === userB.smokingHabit) lifestyleScore += 10;
  if (userA.dietaryPreference === userB.dietaryPreference) lifestyleScore += 10;
  lifestyleScore = Math.min(100, lifestyleScore);

  // Overall weighted calculation
  const overall = Math.round(
    personalityScore * 0.35 +
    religiousScore * 0.30 +
    locationScore * 0.20 +
    lifestyleScore * 0.15
  );

  let grade: CompatibilityScore['grade'] = 'Good Match';
  if (overall >= 90) grade = 'Exceptional';
  else if (overall >= 80) grade = 'High Compatibility';
  else if (overall >= 68) grade = 'Good Match';
  else grade = 'Moderate Compatibility';

  return {
    overallPercentage: overall,
    grade,
    factors: [
      {
        title: 'Personality & Shared Interests',
        score: personalityScore,
        description: sharedTraits.length > 0 
          ? `Mutual affinity: ${sharedTraits.join(', ')}`
          : 'Complementary personality profiles'
      },
      {
        title: 'Religious & Moral Values',
        score: religiousScore,
        description: `${userA.religiousPractice} & ${userB.religiousPractice} alignment`
      },
      {
        title: 'Location & Family Dynamics',
        score: locationScore,
        description: userA.district === userB.district 
          ? `Both rooted in ${userA.district} district` 
          : `${userA.district} and ${userB.district} region connection`
      },
      {
        title: 'Lifestyle & Chaperone Compatibility',
        score: lifestyleScore,
        description: 'Halal dietary standards and shared marital expectations'
      }
    ]
  };
}
