export const DEFAULT_MALE_AVATAR = '/src/assets/images/avatar_muslim_male_1790918656733.jpg';
export const DEFAULT_FEMALE_AVATAR = '/src/assets/images/avatar_muslim_female_1790918671916.jpg';

/**
 * Returns a respectful Muslim avatar image if the user hasn't uploaded a photo,
 * or if the photo is missing or a placeholder.
 */
export function getMuslimAvatar(
  gender?: 'male' | 'female',
  existingPhotoUrl?: string
): string {
  if (existingPhotoUrl && existingPhotoUrl.trim() && !existingPhotoUrl.includes('placeholder')) {
    return existingPhotoUrl;
  }

  if (gender === 'female') {
    return DEFAULT_FEMALE_AVATAR;
  }

  return DEFAULT_MALE_AVATAR;
}
