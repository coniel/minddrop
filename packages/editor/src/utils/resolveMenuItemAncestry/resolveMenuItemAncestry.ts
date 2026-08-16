import { Frame } from '@minddrop/ast';

/**
 * Resolves the containers a block sits inside after a menu entry has been
 * applied to it.
 *
 * The entry decides what the block's own container is, so a block which was
 * a list item gives that item up unless the entry is a container of its own.
 * The containers around it are not its to give up and are kept, which is what
 * keeps a block quoted or indented when its type changes.
 *
 * @param ancestry - The block's containers.
 * @param opensInnermost - Whether the block opens its innermost container.
 * @param frame - The container the entry draws, if it draws one.
 * @returns The block's new containers.
 */
export function resolveMenuItemAncestry(
  ancestry: Frame[],
  opensInnermost: boolean,
  frame?: Frame,
): Frame[] {
  const innermost = ancestry[ancestry.length - 1];
  const givesUpItem = opensInnermost && innermost?.kind === 'list-item';
  const context = givesUpItem ? ancestry.slice(0, -1) : ancestry;

  return frame ? [...context, frame] : context;
}
