import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SetMainContentEventData } from '@minddrop/events';
import { TabSetsStore } from '../TabSetsStore';
import { getSet } from '../getSet';
import { newTab } from '../newTab';
import { recordMainContent } from '../recordMainContent';
import { closeTabsForView } from './closeTabsForView';

const SET_ID = 'test-set';

function state(
  main: SetMainContentEventData['main'],
  split: SetMainContentEventData['split'] = null,
  splitRatio = 50,
): SetMainContentEventData {
  return { main, split, splitRatio };
}

describe('closeTabsForView', () => {
  beforeEach(() => {
    TabSetsStore.clear();
  });

  afterEach(() => {
    TabSetsStore.clear();
  });

  it('closes the tab whose main view id matches', () => {
    newTab(SET_ID);
    recordMainContent(SET_ID, state({ view: 'db:view', id: 'db:a' }));
    const closedId = getSet(SET_ID).activeTabId;
    newTab(SET_ID);
    recordMainContent(SET_ID, state({ view: 'db:view', id: 'db:b' }));

    closeTabsForView(SET_ID, 'db:a');

    const { tabs } = getSet(SET_ID);

    expect(tabs).toHaveLength(1);
    expect(tabs.some((tab) => tab.id === closedId)).toBe(false);
  });

  it('clears the split when only the split view id matches', () => {
    newTab(SET_ID);
    recordMainContent(
      SET_ID,
      state(
        { view: 'db:view', id: 'db:main' },
        { view: 'db:view', id: 'db:split' },
        60,
      ),
    );

    closeTabsForView(SET_ID, 'db:split');

    const tab = getSet(SET_ID).tabs[0];

    expect(tab.split).toBeNull();
    expect(tab.main?.id).toBe('db:main');
  });
});
