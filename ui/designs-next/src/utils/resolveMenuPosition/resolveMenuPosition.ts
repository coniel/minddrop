import { DesignElement } from '@minddrop/designs-next';

// Vertical clearance the menu needs above a block, in pixels
const MenuClearance = 48;

// Gap between a block's edge and the menu, in pixels
const MenuGap = 4;

export interface MenuPosition {
  /**
   * The menu wrapper's position styles.
   */
  style: React.CSSProperties;

  /**
   * Which side of the block the menu sits on.
   */
  placement: 'above' | 'below';
}

/**
 * Resolves an element menu's position above a block, flipping below
 * it when the block sits too close to the top edge.
 *
 * @param element - The element the menu attaches to.
 * @param unitSize - The rendered pixel size of a grid unit.
 * @returns The menu wrapper's position styles and placement.
 */
export function resolveMenuPosition(
  element: DesignElement,
  unitSize: number,
): MenuPosition {
  const left = element.column * unitSize;
  const top = element.row * unitSize;

  // Check if the menu fits above the block. If not, place it below.
  if (top < MenuClearance) {
    return {
      style: {
        left,
        top: (element.row + element.rowSpan) * unitSize + MenuGap,
      },
      placement: 'below',
    };
  }

  // Anchor the menu's bottom edge just above the block
  return {
    style: { left, top: top - MenuGap, transform: 'translateY(-100%)' },
    placement: 'above',
  };
}
