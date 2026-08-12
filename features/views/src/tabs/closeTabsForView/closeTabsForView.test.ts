import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SetViewAreaEventData } from '@minddrop/views';
import { TabSetsStore } from '../TabSetsStore';
import { getSet } from '../getSet';
import { newTab } from '../newTab';
import { recordViewArea } from '../recordViewArea';
import { closeTabsForView } from './closeTabsForView';

const VIEW_AREA_ID = 'test-set';

function state(
  main: SetViewAreaEventData['main'],
  split: SetViewAreaEventData['split'] = null,
  splitRatio = 50,
): SetViewAreaEventData {
  return { viewAreaId: VIEW_AREA_ID, main, split, splitRatio };
}

describe('closeTabsForView', () => {
  beforeEach(() => {
    TabSetsStore.clear();
  });

  afterEach(() => {
    TabSetsStore.clear();
  });

  it('closes the tab whose main view id matches', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));
    const closedId = getSet(VIEW_AREA_ID).activeTabId;
    newTab(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));

    closeTabsForView(VIEW_AREA_ID, 'db:a');

    const { tabs } = getSet(VIEW_AREA_ID);

    expect(tabs).toHaveLength(1);
    expect(tabs.some((tab) => tab.id === closedId)).toBe(false);
  });

  it('clears the split when only the split view id matches', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(
      VIEW_AREA_ID,
      state(
        { view: 'db:view', id: 'db:main' },
        { view: 'db:view', id: 'db:split' },
        60,
      ),
    );

    closeTabsForView(VIEW_AREA_ID, 'db:split');

    const tab = getSet(VIEW_AREA_ID).tabs[0];

    expect(tab.split).toBeNull();
    expect(tab.main?.id).toBe('db:main');
  });

  it('prunes the closed view from surviving tabs history', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:c' }));

    closeTabsForView(VIEW_AREA_ID, 'db:b');

    const { tabs } = getSet(VIEW_AREA_ID);

    // The tab survives because no visible pane shows the closed view
    expect(tabs).toHaveLength(1);
    expect(tabs[0].main?.id).toBe('db:c');
    // The first entry is the search view the tab was opened on
    expect(tabs[0].backHistory).toHaveLength(2);
    expect(tabs[0].backHistory?.[1].main?.id).toBe('db:a');
  });
});
