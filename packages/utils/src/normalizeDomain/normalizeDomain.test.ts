import { describe, expect, it } from 'vitest';
import { normalizeDomain } from './normalizeDomain';

describe('normalizeDomain', () => {
  it('strips the scheme', () => {
    expect(normalizeDomain('https://example.com')).toBe('example.com');
  });

  it('strips the path, query and fragment', () => {
    expect(normalizeDomain('example.com/docs?page=1#top')).toBe('example.com');
  });

  it('strips the www subdomain', () => {
    expect(normalizeDomain('www.example.com')).toBe('example.com');
  });

  it('keeps other subdomains', () => {
    expect(normalizeDomain('docs.example.com')).toBe('docs.example.com');
  });

  it('keeps wildcards', () => {
    expect(normalizeDomain('*.example.com')).toBe('*.example.com');
  });

  it('lowercases the domain', () => {
    expect(normalizeDomain('Example.COM')).toBe('example.com');
  });

  it('trims surrounding whitespace and dots', () => {
    expect(normalizeDomain(' .example.com. ')).toBe('example.com');
  });
});
