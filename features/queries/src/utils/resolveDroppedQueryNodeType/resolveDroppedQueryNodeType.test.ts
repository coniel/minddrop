import { describe, expect, it } from 'vitest';
import { DragFixtures } from '@minddrop/drag-and-drop/test-utils';
import { QueryNodeCardDataKey } from '../../constants';
import { resolveDroppedQueryNodeType } from './resolveDroppedQueryNodeType';

const { dropEventData_1 } = DragFixtures;

describe('resolveDroppedQueryNodeType', () => {
  it('resolves the type a node card creates', () => {
    const drop = {
      ...dropEventData_1,
      data: { [QueryNodeCardDataKey]: 'filter' },
    };

    expect(resolveDroppedQueryNodeType(drop)).toBe('filter');
  });

  it('returns null when the drop has no toolbar card', () => {
    expect(resolveDroppedQueryNodeType(dropEventData_1)).toBeNull();
  });
});
