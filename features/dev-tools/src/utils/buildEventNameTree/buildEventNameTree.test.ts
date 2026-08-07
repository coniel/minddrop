import { describe, expect, it } from 'vitest';
import { buildEventNameTree } from './buildEventNameTree';

describe('buildEventNameTree', () => {
  it('returns nothing for no names', () => {
    expect(buildEventNameTree([])).toEqual([]);
  });

  it('splits names into a node per segment', () => {
    expect(buildEventNameTree(['databases:entries:create'])).toEqual([
      {
        segment: 'databases',
        path: 'databases',
        count: 1,
        children: [
          {
            segment: 'entries',
            path: 'databases:entries',
            count: 1,
            children: [
              {
                segment: 'create',
                path: 'databases:entries:create',
                count: 1,
                children: [],
              },
            ],
          },
        ],
      },
    ]);
  });

  it('merges names sharing a prefix', () => {
    const [databases] = buildEventNameTree([
      'databases:entries:create',
      'databases:entries:update',
      'databases:remove',
    ]);

    expect(databases.count).toBe(3);
    expect(databases.children.map((child) => child.segment)).toEqual([
      'entries',
      'remove',
    ]);
    expect(databases.children[0].count).toBe(2);
  });

  it('counts repeated names into every ancestor', () => {
    const [databases] = buildEventNameTree([
      'databases:entries:create',
      'databases:entries:create',
    ]);

    expect(databases.count).toBe(2);
    expect(databases.children[0].children[0].count).toBe(2);
  });

  it('keeps names without segments at the root', () => {
    expect(buildEventNameTree(['ready'])).toEqual([
      { segment: 'ready', path: 'ready', count: 1, children: [] },
    ]);
  });
});
