import { DesignElement } from '@minddrop/designs-next';

// Vertical clearance the menu needs above a block, in pixels
const MenuClearance = 48;

// Gap between a block's edge and the menu, in pixels
const MenuGap = 4;

/**
 * Resolves an element menu's position above a block, flipping below
 * it when the block sits too close to the top edge.
 *
 * @param element - The element the menu attaches to.
 * @param unitSize - The rendered pixel size of a grid unit.
 * @returns The menu wrapper's position styles.
 */
export function resolveMenuPosition(
  element: DesignElement,
  unitSize: number,
): React.CSSProperties {
  const left = element.column * unitSize;
  const top = element.row * unitSize;

  // Check if the menu fits above the block. If not, place it below.
  if (top < MenuClearance) {
    return {
      left,
      top: (element.row + element.rowSpan) * unitSize + MenuGap,
    };
  }

  // Anchor the menu's bottom edge just above the block
  return { left, top: top - MenuGap, transform: 'translateY(-100%)' };
}
