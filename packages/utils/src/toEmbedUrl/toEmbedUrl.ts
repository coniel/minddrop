/**
 * Converts a known media or design URL to its embeddable form.
 * Returns an unrecognised URL unchanged.
 *
 * @param url - The URL.
 * @returns The embeddable URL.
 */
export function toEmbedUrl(url: string): string {
  // Match a YouTube watch or short link
  const youtubeMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/,
  );

  // Convert a match to its embed player
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  // Match a Vimeo link
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);

  // Convert a match to its player
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // Match a Spotify track, album, playlist or episode link
  const spotifyMatch = url.match(
    /open\.spotify\.com\/(track|album|playlist|episode)\/([\w]+)/,
  );

  // Convert a match to its embed player
  if (spotifyMatch) {
    return `https://open.spotify.com/embed/${spotifyMatch[1]}/${spotifyMatch[2]}`;
  }

  // Match a Figma file, design, prototype or board link
  const figmaMatch = url.match(/figma\.com\/(file|design|proto|board)\//);

  // Convert a match to its embed
  if (figmaMatch) {
    return `https://www.figma.com/embed?embed_host=minddrop&url=${encodeURIComponent(url)}`;
  }

  // Return an unrecognised URL unchanged
  return url;
}
