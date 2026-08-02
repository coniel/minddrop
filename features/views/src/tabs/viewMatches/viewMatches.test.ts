import { describe, expect, it } from 'vitest';
import { TabView } from '../TabSetsStore';
import { viewMatches } from './viewMatches';

const tabView: TabView = { view: 'db:view', id: 'db:a', icon: 'icon-a' };

describe('viewMatches', () => {
  it('returns true when the id matches', () => {
    expect(viewMatches(tabView, 'db:a')).toBe(true);
  });

  it('returns false when the id does not match', () => {
    expect(viewMatches(tabView, 'db:b')).toBe(false);
  });

  it('returns false for a null tab view', () => {
    expect(viewMatches(null, 'db:a')).toBe(false);
  });
});
