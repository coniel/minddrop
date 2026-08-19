import { useLayoutEffect, useState } from 'react';
import { SpaceToken, tokenCssVariable } from '@minddrop/designs';

/**
 * Resolves a space token to its current pixel value by measuring
 * a probe element. Gap zones between studio elements are physical
 * elements sized in pixels, so the token's CSS variable must be
 * resolved to a number. Space tokens are `calc()` expressions over
 * the density unit, which computed styles do not evaluate, so the
 * value has to be measured rather than read.
 *
 * @param token - The space token to resolve.
 * @returns The token's pixel value, or 0 when unset.
 */
export function useSpaceTokenPixels(token?: SpaceToken): number {
  const [pixels, setPixels] = useState(0);

  // Measure after commit but before paint, so the resolved gap is
  // applied in the same frame the container renders
  useLayoutEffect(() => {
    // No token, no gap
    if (!token) {
      setPixels(0);

      return;
    }

    // Size a detached probe by the token and read back its width
    const probe = document.createElement('div');

    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    probe.style.width = tokenCssVariable('space', token);

    document.body.appendChild(probe);
    setPixels(probe.getBoundingClientRect().width);
    probe.remove();
  }, [token]);

  return pixels;
}
