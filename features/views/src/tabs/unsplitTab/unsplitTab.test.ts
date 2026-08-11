import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TabSetsStore } from '../TabSetsStore';
import { getSet } from '../getSet';
import { newTab } from '../newTab';
import { splitTab } from '../splitTab';
import { unsplitTab } from './unsplitTab';

const VIEW_AREA_ID = 'test-set';

const view = {
  view: 'test:view',
  icon: 'test-icon',
};

describe('unsplitTab', () => {
  beforeEach(() => {
    TabSetsStore.clear();
  });

  afterEach(() => {
    TabSetsStore.clear();
  });

  it('moves the split pane into a tab after the unsplit one', () => {
    newTab(VIEW_AREA_ID);
    const first = getSet(VIEW_AREA_ID).activeTabId!;
    newTab(VIEW_AREA_ID);
    const second = getSet(VIEW_AREA_ID).activeTabId!;
    splitTab(VIEW_AREA_ID, first, view);

    unsplitTab(VIEW_AREA_ID, first);

    const { tabs, activeTabId } = getSet(VIEW_AREA_ID);

    expect(tabs).toHaveLength(3);
    expect(tabs[0].id).toBe(first);
    expect(tabs[0].split).toBeNull();
    expect(tabs[1].main).toEqual(view);
    expect(tabs[2].id).toBe(second);
    expect(activeTabId).toBe(first);
  });

  it('does nothing when the tab does not exist', () => {
    newTab(VIEW_AREA_ID);
    const tabId = getSet(VIEW_AREA_ID).activeTabId!;
    splitTab(VIEW_AREA_ID, tabId, view);

    unsplitTab(VIEW_AREA_ID, 'missing');

    const { tabs } = getSet(VIEW_AREA_ID);

    expect(tabs).toHaveLength(1);
    expect(tabs[0].split).toEqual(view);
  });
});
