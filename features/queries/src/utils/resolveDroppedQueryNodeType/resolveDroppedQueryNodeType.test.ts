import { describe, expect, it } from 'vitest';
import { DropEventData } from '@minddrop/selection';
import { QueryNodeCardDataKey, QuerySourceCardDataKey } from '../../constants';
import { resolveDroppedQueryNodeType } from './resolveDroppedQueryNodeType';

/**
 * Builds a drop with the given data.
 *
 * @param data - The drop's data.
 * @returns The drop event data.
 */
function dropWithData(data: Record<string, unknown>): DropEventData {
  return {
    targetType: 'query-builder-canvas',
    targetId: 'query',
    position: 'inside',
    data,
    origin: null,
    clientX: 0,
    clientY: 0,
  };
}

describe('resolveDroppedQueryNodeType', () => {
  it('resolves a source node for the source card', () => {
    expect(
      resolveDroppedQueryNodeType(
        dropWithData({ [QuerySourceCardDataKey]: true }),
      ),
    ).toBe('source');
  });

  it('resolves the type a node card creates', () => {
    expect(
      resolveDroppedQueryNodeType(
        dropWithData({ [QueryNodeCardDataKey]: 'filter' }),
      ),
    ).toBe('filter');
  });

  it('returns null when the drop has no toolbar card', () => {
    expect(
      resolveDroppedQueryNodeType(dropWithData({ 'text/plain': 'text' })),
    ).toBeNull();
  });
});
