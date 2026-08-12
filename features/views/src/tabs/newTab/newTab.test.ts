import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DefaultViewName } from '@minddrop/views';
import { TabSetsStore } from '../TabSetsStore';
import { getSet } from '../getSet';
import { newTab } from './newTab';

const VIEW_AREA_ID = 'test-set';

describe('newTab', () => {
  beforeEach(() => {
    TabSetsStore.clear();
  });

  afterEach(() => {
    TabSetsStore.clear();
  });

  it('appends a blank tab and makes it active', () => {
    newTab(VIEW_AREA_ID);

    const { tabs, activeTabId } = getSet(VIEW_AREA_ID);

    expect(tabs).toHaveLength(1);
    expect(tabs[0].main?.view).toBe(DefaultViewName);
    expect(activeTabId).toBe(tabs[0].id);
  });

  it('inserts the tab at the given index', () => {
    newTab(VIEW_AREA_ID);
    const first = getSet(VIEW_AREA_ID).activeTabId!;

    newTab(VIEW_AREA_ID, { index: 0 });

    const { tabs, activeTabId } = getSet(VIEW_AREA_ID);

    expect(tabs.map((tab) => tab.id)).toEqual([activeTabId, first]);
  });

  it('creates the tab with an empty transient state', () => {
    newTab(VIEW_AREA_ID);

    expect(getSet(VIEW_AREA_ID).tabs[0].viewState).toEqual({});
  });
});
