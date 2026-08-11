import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TabSetsStore } from '../TabSetsStore';
import { getSet } from '../getSet';
import { newTab } from '../newTab';
import { setActiveTab } from '../setActiveTab';
import { closeTabsToTheLeft } from './closeTabsToTheLeft';

const VIEW_AREA_ID = 'test-set';

describe('closeTabsToTheLeft', () => {
  beforeEach(() => {
    TabSetsStore.clear();
  });

  afterEach(() => {
    TabSetsStore.clear();
  });

  it('closes the tabs positioned before the given tab', () => {
    newTab(VIEW_AREA_ID);
    newTab(VIEW_AREA_ID);
    const second = getSet(VIEW_AREA_ID).activeTabId!;
    newTab(VIEW_AREA_ID);
    const third = getSet(VIEW_AREA_ID).activeTabId!;

    closeTabsToTheLeft(VIEW_AREA_ID, second);

    const { tabs, activeTabId } = getSet(VIEW_AREA_ID);

    expect(tabs.map((tab) => tab.id)).toEqual([second, third]);
    expect(activeTabId).toBe(third);
  });

  it('activates the given tab when the active tab was closed', () => {
    newTab(VIEW_AREA_ID);
    const first = getSet(VIEW_AREA_ID).activeTabId!;
    newTab(VIEW_AREA_ID);
    const second = getSet(VIEW_AREA_ID).activeTabId!;

    setActiveTab(VIEW_AREA_ID, first);
    closeTabsToTheLeft(VIEW_AREA_ID, second);

    const { tabs, activeTabId } = getSet(VIEW_AREA_ID);

    expect(tabs).toHaveLength(1);
    expect(activeTabId).toBe(second);
  });

  it('does nothing when the tab does not exist', () => {
    newTab(VIEW_AREA_ID);
    newTab(VIEW_AREA_ID);

    closeTabsToTheLeft(VIEW_AREA_ID, 'missing');

    expect(getSet(VIEW_AREA_ID).tabs).toHaveLength(2);
  });
});
