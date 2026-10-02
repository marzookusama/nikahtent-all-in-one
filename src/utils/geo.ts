import { CountryConfig } from '../types';

export const SUPPORTED_COUNTRIES: CountryConfig[] = [
  {
    code: 'LK',
    name: 'Sri Lanka',
    flag: '🇱🇰',
    currencyCode: 'LKR',
    currencySymbol: 'LKR',
    rateToLKR: 1,
    districts: [
      'All',
      'Colombo',
      'Kandy',
      'Galle',
      'Gampaha',
      'Kalutara',
      'Ampara',
      'Batticaloa',
      'Trincomalee',
      'Kurunegala',
      'Puttalam',
      'Matale',
      'Badulla'
    ],
    defaultCoords: { lat: 6.9271, lng: 79.8612 }, // Colombo
    popularCities: ['Colombo 03', 'Colombo 06', 'Dehiwala', 'Kandy', 'Galle', 'Akurana', 'Negombo']
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    currencyCode: 'AED',
    currencySymbol: 'AED',
    rateToLKR: 83.5,
    districts: [
      'All',
      'Dubai',
      'Abu Dhabi',
      'Sharjah',
      'Ajman',
      'Ras Al Khaimah',
      'Fujairah',
      'Al Ain'
    ],
    defaultCoords: { lat: 25.2048, lng: 55.2708 }, // Dubai
    popularCities: ['Downtown Dubai', 'Deira', 'Jumeirah', 'Abu Dhabi Corniche', 'Sharjah City']
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currencyCode: 'GBP',
    currencySymbol: '£',
    rateToLKR: 395.0,
    districts: [
      'All',
      'Greater London',
      'West Midlands / Birmingham',
      'Greater Manchester',
      'West Yorkshire / Leeds & Bradford',
      'Leicestershire',
      'Scotland / Glasgow'
    ],
    defaultCoords: { lat: 51.5074, lng: -0.1278 }, // London
    popularCities: ['East London', 'Whitechapel', 'Birmingham Central', 'Manchester', 'Leicester']
  },
  {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    currencyCode: 'INR',
    currencySymbol: '₹',
    rateToLKR: 3.65,
    districts: [
      'All',
      'Tamil Nadu / Chennai',
      'Kerala / Kozhikode & Kochi',
      'Karnataka / Bengaluru',
      'Telangana / Hyderabad',
      'Maharashtra / Mumbai',
      'Delhi NCR'
    ],
    defaultCoords: { lat: 13.0827, lng: 80.2707 }, // Chennai
    popularCities: ['Chennai', 'Kozhikode', 'Hyderabad', 'Bengaluru', 'Mumbai']
  },
  {
    code: 'MY',
    name: 'Malaysia',
    flag: '🇲🇾',
    currencyCode: 'MYR',
    currencySymbol: 'RM',
    rateToLKR: 68.2,
    districts: [
      'All',
      'Kuala Lumpur',
      'Selangor',
      'Penang',
      'Johor',
      'Perak'
    ],
    defaultCoords: { lat: 3.1390, lng: 101.6869 }, // KL
    popularCities: ['Kuala Lumpur City', 'Petaling Jaya', 'Shah Alam', 'George Town']
  },
  {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    currencyCode: 'AUD',
    currencySymbol: 'A$',
    rateToLKR: 202.0,
    districts: [
      'All',
      'New South Wales / Sydney',
      'Victoria / Melbourne',
      'Queensland / Brisbane',
      'Western Australia / Perth'
    ],
    defaultCoords: { lat: -33.8688, lng: 151.2093 }, // Sydney
    popularCities: ['Sydney Lakemba', 'Auburn', 'Melbourne Broadmeadows', 'Perth']
  },
  {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    currencyCode: 'CAD',
    currencySymbol: 'C$',
    rateToLKR: 220.0,
    districts: [
      'All',
      'Ontario / Greater Toronto',
      'Quebec / Montreal',
      'British Columbia / Vancouver',
      'Alberta / Calgary & Edmonton'
    ],
    defaultCoords: { lat: 43.6532, lng: -79.3832 }, // Toronto
    popularCities: ['Scarborough', 'Mississauga', 'Markham', 'Montreal', 'Calgary']
  }
];

/**
 * Calculates the great-circle distance between two points on the Earth (in km) using Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m away`;
  }
  return `${distanceKm.toFixed(1)} km away`;
}

export function estimateDrivingTime(distanceKm: number): string {
  if (distanceKm < 2) return '3-5 min drive';
  if (distanceKm < 5) return '8-12 min drive';
  if (distanceKm < 15) return '20-25 min drive';
  if (distanceKm < 30) return '35-45 min drive';
  if (distanceKm < 60) return '~1 hr drive';
  return `${Math.round(distanceKm / 50)} hrs drive`;
}

export function convertAndFormatCurrency(
  basePriceLKR: number,
  targetCountryCode: string
): { formatted: string; raw: number; currencySymbol: string } {
  const country = SUPPORTED_COUNTRIES.find((c) => c.code === targetCountryCode) || SUPPORTED_COUNTRIES[0];
  
  if (country.code === 'LK') {
    return {
      formatted: `LKR ${basePriceLKR.toLocaleString()}`,
      raw: basePriceLKR,
      currencySymbol: 'LKR'
    };
  }

  const converted = Math.round(basePriceLKR / country.rateToLKR);
  return {
    formatted: `${country.currencySymbol} ${converted.toLocaleString()}`,
    raw: converted,
    currencySymbol: country.currencySymbol
  };
}
