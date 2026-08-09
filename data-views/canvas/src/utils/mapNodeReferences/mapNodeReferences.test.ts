import { describe, expect, it } from 'vitest';
import { CanvasViewNode } from '../../types';
import { mapNodeReferences } from './mapNodeReferences';

const node: CanvasViewNode = {
  type: 'entry',
  id: 'entry-a',
  x: 0,
  y: 0,
  width: 300,
};

describe('mapNodeReferences', () => {
  it('passes through configs without nodes', () => {
    const config = { options: {} };

    expect(mapNodeReferences(config, () => 'converted')).toBe(config);
  });

  it('converts entry node IDs', () => {
    const config = { data: { nodes: [node] } };

    const result = mapNodeReferences(config, (value) => `ref:${value}`);

    expect(result.data?.nodes).toEqual([{ ...node, id: 'ref:entry-a' }]);
  });

  it('drops nodes with unconvertible IDs', () => {
    const config = {
      data: { nodes: [node, { ...node, id: 'entry-b' }] },
    };

    const result = mapNodeReferences(config, (value) =>
      value === 'entry-a' ? value : null,
    );

    expect(result.data?.nodes).toEqual([node]);
  });

  it('preserves options', () => {
    const config = {
      options: { cardLayoutOverrides: { db: 'layout' } },
      data: { nodes: [node] },
    };

    const result = mapNodeReferences(config, (value) => value);

    expect(result.options).toEqual(config.options);
  });
});
