import { describe, expect, it } from 'vitest';
import { isUrl } from './isUrl';

describe('isUrl', () => {
  it('should return true for valid URLs', () => {
    expect(isUrl('https://www.example.com')).toBe(true);
    expect(isUrl('http://www.example.com')).toBe(true);
    expect(isUrl('ftp://www.example.com')).toBe(true);
    expect(isUrl('gopher://www.example.com')).toBe(true);
    expect(isUrl('ws://www.example.com')).toBe(true);
    expect(isUrl('wss://www.example.com')).toBe(true);
  });

  it('should return false for invalid URLs', () => {
    expect(isUrl('example.com')).toBe(false);
    expect(isUrl('www.example.com')).toBe(false);
    expect(isUrl('https://')).toBe(false);
    expect(isUrl('https:///')).toBe(false);
    expect(isUrl('example.com/')).toBe(false);
    expect(isUrl('/example')).toBe(false);
    expect(isUrl('example/')).toBe(false);
    expect(isUrl('')).toBe(false);
    expect(isUrl('data:text/plain;charset=UTF-8;page=21,the%20data')).toBe(
      false,
    );
    // @ts-expect-error Empty URL
    expect(isUrl()).toBe(false);
  });
});
