import { isDomainMatch } from '@minddrop/utils';
import { getDatabaseContentDefaults } from '../../getDatabaseContentDefaults';
import { CustomContentType } from '../../types';

/**
 * Finds the custom URL content type whose domains a URL matches. A
 * domain without a subdomain also matches its subdomains.
 *
 * @param url - The URL.
 * @returns The custom content type, or null when the URL matches none.
 */
export function findCustomContentTypeByUrl(
  url: string,
): CustomContentType | null {
  // Find the URL type with a domain the URL matches
  const customType = getDatabaseContentDefaults().customTypes.find(
    (type) =>
      type.kind === 'url' &&
      isDomainMatch(url, type.matchers, { includeSubdomains: true }),
  );

  return customType ?? null;
}
