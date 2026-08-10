import { describe, expect, it } from 'vitest';
import { QueryFilterNode } from '../../types';
import { isCompleteQueryFilterNode } from './isCompleteQueryFilterNode';

// A fully configured filter node
const completeNode: QueryFilterNode = {
  id: 'query-node_filter',
  type: 'filter',
  x: 0,
  y: 0,
  property: 'Title',
  propertyType: 'title',
  operator: 'contains',
  value: 'foo',
};

describe('isCompleteQueryFilterNode', () => {
  it('returns true for a fully configured node', () => {
    expect(isCompleteQueryFilterNode(completeNode)).toBe(true);
  });

  it('returns false without a property', () => {
    expect(
      isCompleteQueryFilterNode({
        ...completeNode,
        property: '',
        propertyType: '',
      }),
    ).toBe(false);
  });

  it('returns false without an operator', () => {
    expect(isCompleteQueryFilterNode({ ...completeNode, operator: '' })).toBe(
      false,
    );
  });

  it('returns false without a value', () => {
    expect(
      isCompleteQueryFilterNode({ ...completeNode, value: undefined }),
    ).toBe(false);
  });

  it('returns false with an empty string value', () => {
    expect(isCompleteQueryFilterNode({ ...completeNode, value: '' })).toBe(
      false,
    );
  });

  it('returns false with an empty entry ID list value', () => {
    expect(isCompleteQueryFilterNode({ ...completeNode, value: [] })).toBe(
      false,
    );
  });

  it('returns true for value-less operators without a value', () => {
    expect(
      isCompleteQueryFilterNode({
        ...completeNode,
        operator: 'is-empty',
        value: undefined,
      }),
    ).toBe(true);
  });
});
