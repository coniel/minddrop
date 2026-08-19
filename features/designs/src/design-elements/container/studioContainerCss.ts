import { CSSProperties } from 'react';
import { ObjectFit } from '@minddrop/designs';

/**
 * Emits the background image CSS for a studio container, mapping
 * the fit option onto background sizing. Mirrors the runtime
 * container surface's background handling.
 */
export function createStudioBackgroundImageCss(
  imageSrc: string,
  fit?: ObjectFit,
): CSSProperties {
  return {
    backgroundImage: `url("${imageSrc}")`,
    backgroundSize: resolveBackgroundSize(fit),
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };
}

/**
 * Maps a background image fit option onto its background-size value.
 */
function resolveBackgroundSize(fit?: ObjectFit): string {
  if (fit === 'contain') {
    return 'contain';
  }

  if (fit === 'fill') {
    return '100% 100%';
  }

  return 'cover';
}
