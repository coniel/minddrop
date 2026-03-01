export interface FormatUrlOptions {
  /**
   * Whether to show the protocol (e.g. "https://").
   */
  showProtocol?: boolean;

  /**
   * Whether to show the subdomain (e.g. "www.").
   */
  showSubdomain?: boolean;

  /**
   * Whether to show the domain name (e.g. "example").
   */
  showDomain?: boolean;

  /**
   * Whether to show the top-level domain (e.g. ".com").
   */
  showTld?: boolean;

  /**
   * Whether to show the path, query, and fragment (e.g. "/about?q=1#s").
   */
  showPath?: boolean;
}

/**
 * Formats a URL string by selectively showing or hiding its parts.
 * All parts default to visible when their flag is undefined.
 *
 * @param url - The URL string to format.
 * @param options - Which parts of the URL to show.
 * @returns The formatted URL string.
 */
export function formatUrl(url: string, options: FormatUrlOptions = {}): string {
  const {
    showProtocol = true,
    showSubdomain = true,
    showDomain = true,
    showTld = true,
    showPath = true,
  } = options;

  // Extract protocol
  const protocolMatch = url.match(/^(\w+:\/\/)/);
  const protocol = protocolMatch ? protocolMatch[1] : '';
  const afterProtocol = protocol ? url.slice(protocol.length) : url;

  // Split host from path
  const pathStart = afterProtocol.indexOf('/');
  const host =
    pathStart === -1 ? afterProtocol : afterProtocol.slice(0, pathStart);
  const path = pathStart === -1 ? '' : afterProtocol.slice(pathStart);

  // Split host into parts: subdomain, domain, TLD
  const hostParts = host.split('.');
  let subdomain = '';
  let domain = '';
  let tld = '';

  if (hostParts.length >= 3) {
    // e.g. ["www", "example", "com"] or ["blog", "example", "co", "uk"]
    subdomain = hostParts.slice(0, -2).join('.') + '.';
    domain = hostParts[hostParts.length - 2];
    tld = '.' + hostParts[hostParts.length - 1];
  } else if (hostParts.length === 2) {
    // e.g. ["example", "com"]
    domain = hostParts[0];
    tld = '.' + hostParts[1];
  } else {
    // Single part (e.g. "localhost")
    domain = host;
  }

  // Build the result from visible parts
  let result = '';

  if (showProtocol && protocol) {
    result += protocol;
  }

  if (showSubdomain && subdomain) {
    result += subdomain;
  }

  if (showDomain) {
    result += domain;
  }

  if (showTld && tld) {
    result += tld;
  }

  if (showPath && path) {
    result += path;
  }

  return result;
}
