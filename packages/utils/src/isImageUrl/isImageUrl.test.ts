import { describe, it, expect } from 'vitest';
import { isImageUrl } from './isImageUrl';

describe('isImageUrl', () => {
  it('returns `true` for image URLs', () => {
    expect(isImageUrl('https://example.com/foo.jpg')).toBe(true);
    expect(isImageUrl('https://example.com/foo.jpeg')).toBe(true);
    expect(isImageUrl('https://example.com/foo.png')).toBe(true);
    expect(isImageUrl('https://example.com/foo.webp')).toBe(true);
    expect(isImageUrl('https://example.com/foo.avif')).toBe(true);
    expect(isImageUrl('https://example.com/foo.gif')).toBe(true);
    expect(isImageUrl('https://example.com/foo.svg')).toBe(true);
  });

  it('works with URLs containig query parameters', () => {
    expect(isImageUrl('https://example.com/foo.jpg?height=100&width=100')).toBe(
      true,
    );
  });

  it('works with URLs containig hash parameters', () => {
    expect(isImageUrl('https://example.com/foo.jpg#foo')).toBe(true);
  });

  it('returns `false` if the URL is not an image', () => {
    expect(isImageUrl('https://example.com/foo.html'));
  });
});
