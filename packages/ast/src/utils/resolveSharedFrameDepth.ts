import { Frame } from '../types';

/**
 * Returns the number of leading frames two blocks have in common, which is
 * the depth at which their containers diverge.
 *
 * @param ancestry - The first block's ancestry.
 * @param otherAncestry - The second block's ancestry.
 * @returns The shared depth.
 */
export function resolveSharedFrameDepth(
  ancestry: Frame[] = [],
  otherAncestry: Frame[] = [],
): number {
  let depth = 0;

  while (
    depth < ancestry.length &&
    depth < otherAncestry.length &&
    ancestry[depth].id === otherAncestry[depth].id
  ) {
    depth += 1;
  }

  return depth;
}
