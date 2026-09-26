/**
 * Normalizes a domain. Strips the scheme, path, query, fragment,
 * `www.` subdomain and surrounding whitespace and dots, then
 * lowercases it.
 *
 * @param domain - The domain, or a URL to take the domain from.
 * @returns The normalized domain.
 */
export function normalizeDomain(domain: string): string {
  // Strip everything but the domain and lowercase it
  return domain
    .trim()
    .toLowerCase()
    .replace(/^[a-z][a-z0-9+.-]*:\/\//, '')
    .replace(/[/?#].*$/, '')
    .replace(/^www\./, '')
    .replace(/^\.+|\.+$/g, '');
}
