import { Frame } from '@minddrop/ast';

/**
 * Resolves the containers a dropped run of blocks lands inside, which its
 * blocks keep their own containers within.
 *
 * A run led by a block which opens a container takes the place of the
 * container the block above it opened, landing as its sibling. A run led by
 * any other block joins the containers already around where it lands.
 *
 * @param aboveAncestry - The containers of the block the run lands below.
 * @param opensContainer - Whether the run's first block opens its innermost container.
 * @returns The containers the run lands inside.
 */
export function resolveDroppedAncestry(
  aboveAncestry: Frame[],
  opensContainer: boolean,
): Frame[] {
  if (opensContainer) {
    return aboveAncestry.slice(0, -1);
  }

  return aboveAncestry;
}
