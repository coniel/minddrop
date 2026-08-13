import { describe, expect, it } from 'vitest';
import { layout_card_1, layout_page_1 } from '../../test-utils';
import { getNewLayoutPosition } from './getNewLayoutPosition';

describe('getNewLayoutPosition', () => {
  it('returns undefined when the design has no layouts', () => {
    expect(getNewLayoutPosition([])).toBeUndefined();
  });

  it('positions the layout right of the rightmost frame, aligned with the topmost one', () => {
    const layouts = [
      { ...layout_card_1, frame: { x: 0, y: 40, width: 380 } },
      { ...layout_page_1, frame: { x: 500, y: 100, width: 800, height: 600 } },
    ];

    expect(getNewLayoutPosition(layouts)).toEqual({ x: 1400, y: 40 });
  });
});
