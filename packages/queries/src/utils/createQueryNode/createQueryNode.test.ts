import { describe, expect, it } from 'vitest';
import { createQueryNode } from './createQueryNode';

describe('createQueryNode', () => {
  it('creates a source node with the given database', () => {
    const node = createQueryNode(
      'source',
      { x: 10, y: 20 },
      { database: 'database_objects' },
    );

    expect(node).toEqual({
      id: expect.any(String),
      type: 'source',
      x: 10,
      y: 20,
      database: 'database_objects',
    });
  });

  it('creates an unconfigured filter node', () => {
    const node = createQueryNode('filter', { x: 0, y: 0 });

    expect(node).toEqual({
      id: expect.any(String),
      type: 'filter',
      x: 0,
      y: 0,
      property: '',
      propertyType: '',
      operator: '',
    });
  });

  it('creates an unconfigured ascending sort node', () => {
    const node = createQueryNode('sort', { x: 0, y: 0 });

    expect(node).toEqual({
      id: expect.any(String),
      type: 'sort',
      x: 0,
      y: 0,
      property: '',
      propertyType: '',
      direction: 'ascending',
    });
  });

  it('creates an uncapped limit node', () => {
    const node = createQueryNode('limit', { x: 0, y: 0 });

    expect(node).toEqual({
      id: expect.any(String),
      type: 'limit',
      x: 0,
      y: 0,
      count: 0,
    });
  });

  it('creates a results node', () => {
    const node = createQueryNode('results', { x: 0, y: 0 });

    expect(node).toEqual({
      id: expect.any(String),
      type: 'results',
      x: 0,
      y: 0,
    });
  });
});
