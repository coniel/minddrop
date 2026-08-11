import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TabSetsStore } from '../TabSetsStore';
import { getSet } from '../getSet';
import { newTab } from '../newTab';
import { updateTab } from '../updateTab';
import { splitTabWithTab } from './splitTabWithTab';

const VIEW_AREA_ID = 'test-set';

const view = {
  view: 'test:view',
  icon: 'test-icon',
  title: 'Test view',
};

describe('splitTabWithTab', () => {
  beforeEach(() => {
    TabSetsStore.clear();
  });

  afterEach(() => {
    TabSetsStore.clear();
  });

  it('moves the source tab into the split pane and closes it', () => {
    newTab(VIEW_AREA_ID);
    const first = getSet(VIEW_AREA_ID).activeTabId!;
    newTab(VIEW_AREA_ID);
    const second = getSet(VIEW_AREA_ID).activeTabId!;
    updateTab(VIEW_AREA_ID, second, { main: view });

    splitTabWithTab(VIEW_AREA_ID, first, second);

    const { tabs, activeTabId } = getSet(VIEW_AREA_ID);

    expect(tabs).toHaveLength(1);
    expect(tabs[0].id).toBe(first);
    expect(tabs[0].split).toEqual(view);
    expect(activeTabId).toBe(first);
  });

  it('does nothing when the source tab has no view', () => {
    newTab(VIEW_AREA_ID);
    const first = getSet(VIEW_AREA_ID).activeTabId!;
    newTab(VIEW_AREA_ID);
    const second = getSet(VIEW_AREA_ID).activeTabId!;

    splitTabWithTab(VIEW_AREA_ID, first, second);

    const { tabs } = getSet(VIEW_AREA_ID);

    expect(tabs).toHaveLength(2);
    expect(tabs[0].split).toBeNull();
  });

  it('does nothing when the tab does not exist', () => {
    newTab(VIEW_AREA_ID);
    const first = getSet(VIEW_AREA_ID).activeTabId!;
    updateTab(VIEW_AREA_ID, first, { main: view });

    splitTabWithTab(VIEW_AREA_ID, 'missing', first);

    expect(getSet(VIEW_AREA_ID).tabs).toHaveLength(1);
  });
});
