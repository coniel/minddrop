import { describe, expect, it } from 'vitest';
import {
  coverDesignElement,
  titleDesignElement,
} from '@minddrop/designs-next/test-utils';
import { resolveMenuPosition } from './resolveMenuPosition';

describe('resolveMenuPosition', () => {
  it('anchors the menu just above the block', () => {
    // The title sits well below the top edge
    const position = resolveMenuPosition(titleDesignElement, 10);

    expect(position).toEqual({
      left: titleDesignElement.column * 10,
      top: titleDesignElement.row * 10 - 4,
      transform: 'translateY(-100%)',
    });
  });

  it('places the menu below blocks near the top edge', () => {
    // The cover sits at the top edge
    const position = resolveMenuPosition(coverDesignElement, 10);

    expect(position).toEqual({
      left: 0,
      top: (coverDesignElement.row + coverDesignElement.rowSpan) * 10 + 4,
    });
  });
});
