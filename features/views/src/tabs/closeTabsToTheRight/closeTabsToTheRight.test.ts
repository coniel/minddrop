import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TabSetsStore } from '../TabSetsStore';
import { getSet } from '../getSet';
import { newTab } from '../newTab';
import { setActiveTab } from '../setActiveTab';
import { closeTabsToTheRight } from './closeTabsToTheRight';

const VIEW_AREA_ID = 'test-set';

describe('closeTabsToTheRight', () => {
  beforeEach(() => {
    TabSetsStore.clear();
  });

  afterEach(() => {
    TabSetsStore.clear();
  });

  it('closes the tabs positioned after the given tab', () => {
    newTab(VIEW_AREA_ID);
    const first = getSet(VIEW_AREA_ID).activeTabId!;
    newTab(VIEW_AREA_ID);
    const second = getSet(VIEW_AREA_ID).activeTabId!;
    newTab(VIEW_AREA_ID);

    setActiveTab(VIEW_AREA_ID, first);
    closeTabsToTheRight(VIEW_AREA_ID, second);

    const { tabs, activeTabId } = getSet(VIEW_AREA_ID);

    expect(tabs.map((tab) => tab.id)).toEqual([first, second]);
    expect(activeTabId).toBe(first);
  });

  it('activates the given tab when the active tab was closed', () => {
    newTab(VIEW_AREA_ID);
    const first = getSet(VIEW_AREA_ID).activeTabId!;
    newTab(VIEW_AREA_ID);

    closeTabsToTheRight(VIEW_AREA_ID, first);

    const { tabs, activeTabId } = getSet(VIEW_AREA_ID);

    expect(tabs).toHaveLength(1);
    expect(activeTabId).toBe(first);
  });

  it('does nothing when the tab does not exist', () => {
    newTab(VIEW_AREA_ID);
    newTab(VIEW_AREA_ID);

    closeTabsToTheRight(VIEW_AREA_ID, 'missing');

    expect(getSet(VIEW_AREA_ID).tabs).toHaveLength(2);
  });
});
