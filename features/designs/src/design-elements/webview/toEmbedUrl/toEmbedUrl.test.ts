import { describe, expect, it } from 'vitest';
import { toEmbedUrl } from './toEmbedUrl';

describe('toEmbedUrl', () => {
  it('converts YouTube watch URLs to embed URLs', () => {
    expect(toEmbedUrl('https://www.youtube.com/watch?v=abc-123')).toBe(
      'https://www.youtube.com/embed/abc-123',
    );
  });

  it('converts youtu.be short URLs to embed URLs', () => {
    expect(toEmbedUrl('https://youtu.be/abc-123')).toBe(
      'https://www.youtube.com/embed/abc-123',
    );
  });

  it('converts Vimeo URLs to player embed URLs', () => {
    expect(toEmbedUrl('https://vimeo.com/12345')).toBe(
      'https://player.vimeo.com/video/12345',
    );
  });

  it('converts Spotify URLs to embed URLs', () => {
    expect(toEmbedUrl('https://open.spotify.com/track/abc123')).toBe(
      'https://open.spotify.com/embed/track/abc123',
    );
  });

  it('converts Figma URLs to embed URLs', () => {
    expect(toEmbedUrl('https://www.figma.com/design/abc/My-File')).toBe(
      `https://www.figma.com/embed?embed_host=minddrop&url=${encodeURIComponent(
        'https://www.figma.com/design/abc/My-File',
      )}`,
    );
  });

  it('returns unrecognised URLs unchanged', () => {
    expect(toEmbedUrl('https://example.com/page')).toBe(
      'https://example.com/page',
    );
  });
});
