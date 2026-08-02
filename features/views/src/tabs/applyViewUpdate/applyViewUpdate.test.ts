import { describe, expect, it } from 'vitest';
import { TabView } from '../TabSetsStore';
import { applyViewUpdate } from './applyViewUpdate';

const tabView: TabView = {
  view: 'db:view',
  id: 'db:a',
  props: { databaseId: 'a' },
  title: 'A',
  icon: 'icon-a',
};

describe('applyViewUpdate', () => {
  it('applies the id, props, title and icon when the view matches', () => {
    const updated = applyViewUpdate(tabView, 'db:a', {
      id: 'db:b',
      props: { databaseId: 'b' },
      title: 'B',
      icon: 'icon-b',
    });

    expect(updated).toEqual({
      view: 'db:view',
      id: 'db:b',
      props: { databaseId: 'b' },
      title: 'B',
      icon: 'icon-b',
    });
  });

  it('merges props into the existing props', () => {
    const updated = applyViewUpdate(tabView, 'db:a', {
      props: { extra: true },
    });

    expect(updated?.props).toEqual({ databaseId: 'a', extra: true });
  });

  it('returns the tab view unchanged when it does not match', () => {
    expect(applyViewUpdate(tabView, 'db:other', { title: 'X' })).toBe(tabView);
  });

  it('returns null for a null tab view', () => {
    expect(applyViewUpdate(null, 'db:a', { title: 'X' })).toBeNull();
  });
});
