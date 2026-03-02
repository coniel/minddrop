/**
 * Converts known URLs to their embeddable equivalents.
 * Falls back to the original URL for unrecognised patterns.
 */
export function toEmbedUrl(url: string): string {
  // YouTube: youtube.com/watch?v=ID or youtu.be/ID → embed
  const youtubeMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/,
  );

  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  // Vimeo: vimeo.com/ID → player embed
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);

  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // Spotify: open.spotify.com/track/ID (or album, playlist, episode) → embed
  const spotifyMatch = url.match(
    /open\.spotify\.com\/(track|album|playlist|episode)\/([\w]+)/,
  );

  if (spotifyMatch) {
    return `https://open.spotify.com/embed/${spotifyMatch[1]}/${spotifyMatch[2]}`;
  }

  // Figma: figma.com/file/... or figma.com/design/... → embed
  const figmaMatch = url.match(/figma\.com\/(file|design|proto|board)\//);

  if (figmaMatch) {
    return `https://www.figma.com/embed?embed_host=minddrop&url=${encodeURIComponent(url)}`;
  }

  return url;
}
