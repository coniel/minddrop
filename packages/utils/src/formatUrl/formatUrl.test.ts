import { describe, expect, it } from 'vitest';
import { formatUrl } from './formatUrl';

// A URL with every part
const url = 'https://www.example.com/about?q=1#section';

describe('formatUrl', () => {
  it('shows every part by default', () => {
    expect(formatUrl(url)).toBe(url);
  });

  it('shows the given parts alone', () => {
    expect(formatUrl(url, ['domain', 'tld'])).toBe('example.com');
  });

  it('shows the protocol', () => {
    expect(formatUrl(url, ['protocol', 'domain'])).toBe('https://example');
  });

  it('shows the subdomain', () => {
    expect(formatUrl(url, ['subdomain', 'domain'])).toBe('www.example');
  });

  it('shows the path with its query and fragment', () => {
    expect(formatUrl(url, ['path'])).toBe('/about?q=1#section');
  });

  it('joins the shown host parts without the hidden one between them', () => {
    expect(formatUrl(url, ['subdomain', 'tld'])).toBe('www.com');
  });

  it('reads a host of two labels as a domain and top-level domain', () => {
    expect(formatUrl('https://example.com/page', ['domain'])).toBe('example');
  });

  it('reads a host of one label as a domain', () => {
    expect(formatUrl('http://localhost/page', ['domain'])).toBe('localhost');
  });

  it('reads a public suffix of more than one label as the top-level domain', () => {
    expect(formatUrl('https://www.bbc.co.uk/news', ['domain', 'tld'])).toBe(
      'bbc.co.uk',
    );
    expect(formatUrl('https://www.example.or.jp', ['domain'])).toBe('example');
  });

  it('keeps the port with the shown host', () => {
    expect(formatUrl('https://www.example.com:8080/x', ['domain', 'tld'])).toBe(
      'example.com:8080',
    );
  });

  it('keeps the credentials with the shown host', () => {
    expect(formatUrl('https://user@www.example.com/x', ['domain', 'tld'])).toBe(
      'user@example.com',
    );
  });

  it('reads an IP address as a domain', () => {
    expect(formatUrl('http://192.168.1.10:3000/a', ['domain'])).toBe(
      '192.168.1.10:3000',
    );
  });

  it('splits off a protocol written without slashes', () => {
    expect(formatUrl('mailto:hello@example.com', ['domain', 'tld'])).toBe(
      'hello@example.com',
    );
  });

  it('drops a trailing dot from the host', () => {
    expect(formatUrl('https://example.com./x', ['domain', 'tld'])).toBe(
      'example.com',
    );
  });

  it('formats a URL without a protocol', () => {
    expect(formatUrl('www.example.com/page', ['domain', 'tld', 'path'])).toBe(
      'example.com/page',
    );
  });

  it('splits the path off at a query with no path before it', () => {
    expect(formatUrl('https://example.com?q=1', ['domain', 'tld'])).toBe(
      'example.com',
    );
  });

  it('formats an address without the shown parts as nothing', () => {
    expect(formatUrl('https://example.com', ['path'])).toBe('');
  });
});
