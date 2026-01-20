import { isUrl } from '../isUrl';

/**
 * Checks whether a URL end in an image file extension.
 * Removes any query or hash parameters before checking.
 *
 * @param url - The URL to check.
 * @returns Boolean indicating whether the URL is that of an image.
 */
export function isImageUrl(url: string) {
  if (!isUrl(url)) {
    return false;
  }

  // Remove any query parameters from the URL
  let cleaned = url.split('?')[0];

  // Remove any hash parameters from the URL
  cleaned = cleaned.split('#')[0];

  return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(cleaned);
}
