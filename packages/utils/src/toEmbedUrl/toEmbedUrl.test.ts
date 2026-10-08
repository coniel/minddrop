import { describe, expect, it } from 'vitest';
import { toEmbedUrl } from './toEmbedUrl';

describe('toEmbedUrl', () => {
  it('converts a YouTube watch link to its embed player', () => {
    expect(toEmbedUrl('https://www.youtube.com/watch?v=abc-123')).toBe(
      'https://www.youtube.com/embed/abc-123',
    );
  });

  it('converts a YouTube watch link with further parameters to its embed player', () => {
    expect(toEmbedUrl('https://www.youtube.com/watch?v=abc-123&t=10s')).toBe(
      'https://www.youtube.com/embed/abc-123',
    );
  });

  it('converts a YouTube short link to its embed player', () => {
    expect(toEmbedUrl('https://youtu.be/abc-123')).toBe(
      'https://www.youtube.com/embed/abc-123',
    );
  });

  it('converts a Vimeo link to its player', () => {
    expect(toEmbedUrl('https://vimeo.com/12345')).toBe(
      'https://player.vimeo.com/video/12345',
    );
  });

  it.each(['track', 'album', 'playlist', 'episode'])(
    'converts a Spotify %s link to its embed player',
    (kind) => {
      expect(toEmbedUrl(`https://open.spotify.com/${kind}/abc123`)).toBe(
        `https://open.spotify.com/embed/${kind}/abc123`,
      );
    },
  );

  it.each(['file', 'design', 'proto', 'board'])(
    'converts a Figma %s link to its embed',
    (kind) => {
      const url = `https://www.figma.com/${kind}/abc/My-File`;

      expect(toEmbedUrl(url)).toBe(
        `https://www.figma.com/embed?embed_host=minddrop&url=${encodeURIComponent(url)}`,
      );
    },
  );

  it('returns an unrecognised link unchanged', () => {
    expect(toEmbedUrl('https://example.com/page')).toBe(
      'https://example.com/page',
    );
  });
});
