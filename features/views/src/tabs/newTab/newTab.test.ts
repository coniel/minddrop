import { afterEach, beforeEach, describe, expect, it } from 'vitest';
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
    expect(tabs[0].main).toBeNull();
    expect(activeTabId).toBe(tabs[0].id);
  });

  it('creates the tab with an empty transient state', () => {
    newTab(VIEW_AREA_ID);

    expect(getSet(VIEW_AREA_ID).tabs[0].viewState).toEqual({});
  });
});
