import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SetMainContentEventData } from '@minddrop/events';
import { TabSetsStore } from '../TabSetsStore';
import { getSet } from '../getSet';
import { newTab } from '../newTab';
import { recordMainContent } from '../recordMainContent';
import { updateTabsForView } from './updateTabsForView';

const SET_ID = 'test-set';

function state(
  main: SetMainContentEventData['main'],
  split: SetMainContentEventData['split'] = null,
  splitRatio = 50,
): SetMainContentEventData {
  return { main, split, splitRatio };
}

describe('updateTabsForView', () => {
  beforeEach(() => {
    TabSetsStore.clear();
  });

  afterEach(() => {
    TabSetsStore.clear();
  });

  it('updates the id, props, title and icon of the matching view', () => {
    newTab(SET_ID);
    recordMainContent(
      SET_ID,
      state({
        view: 'db:view',
        id: 'db:a',
        props: { databaseId: 'a' },
        title: 'A',
        icon: 'icon-a',
      }),
    );

    updateTabsForView(SET_ID, 'db:a', {
      id: 'db:b',
      props: { databaseId: 'b' },
      title: 'B',
      icon: 'icon-b',
    });

    const main = getSet(SET_ID).tabs[0].main;

    expect(main?.id).toBe('db:b');
    expect(main?.props).toEqual({ databaseId: 'b' });
    expect(main?.title).toBe('B');
    expect(main?.icon).toBe('icon-b');
  });

  it('leaves non-matching views unchanged', () => {
    newTab(SET_ID);
    recordMainContent(
      SET_ID,
      state({ view: 'db:view', id: 'db:a', title: 'A' }),
    );

    updateTabsForView(SET_ID, 'db:other', { title: 'X' });

    expect(getSet(SET_ID).tabs[0].main?.title).toBe('A');
  });
});
