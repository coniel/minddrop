import { describe, expect, it } from 'vitest';
import { formatUrl } from './formatUrl';

describe('formatUrl', () => {
  const fullUrl = 'https://www.example.com/about?q=1#section';

  it('returns the full URL when all parts are shown', () => {
    expect(formatUrl(fullUrl)).toBe(fullUrl);
  });

  it('hides the protocol when showProtocol is false', () => {
    expect(formatUrl(fullUrl, { showProtocol: false })).toBe(
      'www.example.com/about?q=1#section',
    );
  });

  it('hides the subdomain when showSubdomain is false', () => {
    expect(formatUrl(fullUrl, { showSubdomain: false })).toBe(
      'https://example.com/about?q=1#section',
    );
  });

  it('hides the domain when showDomain is false', () => {
    expect(formatUrl(fullUrl, { showDomain: false })).toBe(
      'https://www..com/about?q=1#section',
    );
  });

  it('hides the TLD when showTld is false', () => {
    expect(formatUrl(fullUrl, { showTld: false })).toBe(
      'https://www.example/about?q=1#section',
    );
  });

  it('hides the path when showPath is false', () => {
    expect(formatUrl(fullUrl, { showPath: false })).toBe(
      'https://www.example.com',
    );
  });

  it('hides multiple parts at once', () => {
    expect(
      formatUrl(fullUrl, {
        showProtocol: false,
        showSubdomain: false,
        showPath: false,
      }),
    ).toBe('example.com');
  });

  it('handles URLs without a subdomain', () => {
    expect(formatUrl('https://example.com/path', { showPath: false })).toBe(
      'https://example.com',
    );
  });

  it('handles URLs without a path', () => {
    expect(formatUrl('https://www.example.com')).toBe(
      'https://www.example.com',
    );
  });

  it('handles URLs without a protocol', () => {
    expect(formatUrl('www.example.com/path', { showSubdomain: false })).toBe(
      'example.com/path',
    );
  });

  it('shows only the domain when all other parts are hidden', () => {
    expect(
      formatUrl(fullUrl, {
        showProtocol: false,
        showSubdomain: false,
        showTld: false,
        showPath: false,
      }),
    ).toBe('example');
  });
});
