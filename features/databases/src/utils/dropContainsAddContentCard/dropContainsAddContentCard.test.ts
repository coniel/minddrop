import { describe, expect, it } from 'vitest';
import { DragFixtures } from '@minddrop/drag-and-drop/test-utils';
import { AddContentDataKey } from '@minddrop/ui-databases';
import { dropContainsAddContentCard } from './dropContainsAddContentCard';

const { dropEventData_1 } = DragFixtures;

describe('dropContainsAddContentCard', () => {
  it('returns true when the drop contains an add content card', () => {
    const data = { ...dropEventData_1, data: { [AddContentDataKey]: true } };

    expect(dropContainsAddContentCard(data)).toBe(true);
  });

  it('returns false when the drop contains no add content card', () => {
    expect(dropContainsAddContentCard(dropEventData_1)).toBe(false);
  });
});
