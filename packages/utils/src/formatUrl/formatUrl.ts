import { parse } from 'tldts';

/**
 * A part of a URL, in the order the parts are written: the protocol
 * (https://), the subdomain (www), the domain (example), the
 * top-level domain (com), and the path with its query and fragment
 * (/page?q=1#top).
 */
export type UrlPart = 'protocol' | 'subdomain' | 'domain' | 'tld' | 'path';

// Matches a protocol: a scheme followed by //, or one of the
// schemes written without it.
const ProtocolPattern = /^([a-z][\w+.-]*:\/\/|(mailto|tel|sms):)/i;

/**
 * Formats a URL with only the given parts shown. The host's shown
 * parts are joined by dots, and keep the address's credentials and
 * port while any of them is shown. The top-level domain is the
 * host's public suffix, so co.uk is one. An IP address or a host of
 * one label is a domain alone.
 *
 * @param url - The URL to format.
 * @param parts - The parts to show. All of them when omitted.
 * @returns The formatted URL.
 */
export function formatUrl(url: string, parts?: UrlPart[]): string {
  // Check whether a part is shown, every part when none are given
  const shows = (part: UrlPart) => !parts || parts.includes(part);

  // Split off the protocol
  const protocol = url.match(ProtocolPattern)?.[0] ?? '';
  const afterProtocol = url.slice(protocol.length);

  // Split the authority from the path at the first slash, query or
  // fragment.
  const pathStart = afterProtocol.search(/[/?#]/);
  const authority =
    pathStart === -1 ? afterProtocol : afterProtocol.slice(0, pathStart);
  const path = pathStart === -1 ? '' : afterProtocol.slice(pathStart);

  // Split the credentials and the port off the host, dropping a
  // trailing dot. A bracketed IPv6 address keeps its colons.
  const userinfo = authority.slice(0, authority.lastIndexOf('@') + 1);
  const hostAndPort = authority.slice(userinfo.length);
  const port = hostAndPort.match(/:\d*$/)?.[0] ?? '';
  const host = hostAndPort
    .slice(0, hostAndPort.length - port.length)
    .replace(/\.$/, '');

  // Split the host into its subdomain, domain and top-level domain
  // by its public suffix. An IP address or a host of one label is a
  // domain alone.
  const isIpAddress = /^[\d.]+$/.test(host) || host.startsWith('[');
  const suffixed = !isIpAddress && host.includes('.');
  const hostParts = suffixed ? parse(host) : null;
  const subdomain = hostParts?.subdomain ?? '';
  const domain = hostParts ? (hostParts.domainWithoutSuffix ?? '') : host;
  const tld = hostParts?.publicSuffix ?? '';

  // Join the host's shown parts
  const shownHost = [
    shows('subdomain') ? subdomain : '',
    shows('domain') ? domain : '',
    shows('tld') ? tld : '',
  ]
    .filter(Boolean)
    .join('.');

  // Join the shown parts
  return [
    // The protocol
    shows('protocol') ? protocol : '',
    // The host, with its credentials and port while any of it shows
    shownHost ? `${userinfo}${shownHost}${port}` : '',
    // The path
    shows('path') ? path : '',
  ].join('');
}
