import isUrl from 'is-url';
import { getDomainWithoutSuffix, getSubdomain, getPublicSuffix } from 'tldts';

/**
 * Checks a string to determine if it is a URL and whether that URL matches
 * against a list of domain matchers, returning a boolean indicating whether
 * the URL matches any of the matchers.
 *
 * Matchers are a list of domains, such as:
 * - 'minddrop.app' to match a specific domain and TLD
 * - 'docs.minddrop.app' to match a specific subdomain, domain, and TLD
 * - '*.minddrop.app' to match any subdomain on a specific domain and TLD
 * - 'minddrop.*' to match any TLD on a specific domain
 * - '*.minddrop.*' to match any subdomain and TLD on a specific domain
 * - '*' to match any domain, including any subdomain and TLD
 *
 * The 'www' subdomain is ignored in URLs unless the matcher
 * specifies a subdomain (meaning 'https://www.minddrop.app'
 * will match 'minddrop.app' but not 'docs.minddrop.app').
 *
 * For more control over the matching, a function can be provided which receives
 * the URL and returns a boolean indicating a match.
 *
 * @param url - The URL to check.
 * @param matchers - The matchers to check against.
 * @returns A boolean indicating whether a match was found.
 */
export function isDomainMatch(
  url: string,
  matchers: (string | ((url: string) => boolean))[],
): boolean {
  if (!isUrl(url)) {
    // If `url` is not a URL, don't bother checking
    // for matches.
    return false;
  }

  let matched = false;
  // The URL's domain with the TLD
  const domain = getDomainWithoutSuffix(url);
  // The URL's TLD
  const tld = getPublicSuffix(url);
  // The URL's subdomain
  const subdomain = getSubdomain(url);

  // Loop through the matchers until a match is found
  matchers.every((matcher) => {
    // If the matcher is a wildcard, it always is a match
    if (matcher === '*') {
      matched = true;
      // Break the loop
      return false;
    }
    // If a match has already been found
    if (typeof matcher === 'string') {
      // Whether the matcher has a wildcard subdomain
      const isWildcardSubdomain = matcher.charAt(0) === '*';
      // Whether the matcher has a wildcard TLD
      const isWildcardTld = matcher.charAt(matcher.length - 1) === '*';
      // If the matcher has a wildcard subdomain, remove it
      // in order to get a valid URL for the URL parser.
      let validMatcher = isWildcardSubdomain ? matcher.slice(2) : matcher;
      // If the matcher has a wildcard TLD, replace it with
      // '.com' in order to get a valid URL for the URL parser.
      validMatcher = isWildcardTld
        ? `${validMatcher.slice(0, -2)}.com`
        : validMatcher;
      // The matcher's domain without the TLD
      const matcherDomain = getDomainWithoutSuffix(validMatcher);
      // The matcher's TLD
      const matcherTld = getPublicSuffix(validMatcher);
      // The matcher's subdomain
      const matcherSubdomain = getSubdomain(validMatcher);

      if (matcherDomain !== domain) {
        // Domain does not match
        return true;
      }

      if (matcherTld !== tld && !isWildcardTld) {
        // TLD does not match
        return true;
      }

      if (isWildcardTld && !tld) {
        // URL has no TLD
        return true;
      }

      if (
        matcherSubdomain !== subdomain &&
        !isWildcardSubdomain &&
        // Ignore 'www' as a subdomain
        subdomain !== 'www'
      ) {
        // Subdomain does not match
        return true;
      }

      if (
        subdomain === 'www' &&
        matcherSubdomain &&
        matcherSubdomain !== 'www'
      ) {
        // Matcher has a subdomain which is not 'www'
        return true;
      }

      if (isWildcardSubdomain && !subdomain) {
        // URL has no subdomain
        return true;
      }

      matched = true;
    }

    if (typeof matcher === 'function') {
      matched = matcher(url) || matched;
    }

    // Break the loop if a match is found
    return !matched;
  });

  return matched;
}
