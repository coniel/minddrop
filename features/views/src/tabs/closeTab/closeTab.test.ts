import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TabSetsStore } from '../TabSetsStore';
import { getSet } from '../getSet';
import { newTab } from '../newTab';
import { closeTab } from './closeTab';

const VIEW_AREA_ID = 'test-set';

describe('closeTab', () => {
  beforeEach(() => {
    TabSetsStore.clear();
  });

  afterEach(() => {
    TabSetsStore.clear();
  });

  it('removes the tab and activates a neighbour', () => {
    newTab(VIEW_AREA_ID);
    const first = getSet(VIEW_AREA_ID).activeTabId;
    newTab(VIEW_AREA_ID);
    const second = getSet(VIEW_AREA_ID).activeTabId!;

    closeTab(VIEW_AREA_ID, second);

    const { tabs, activeTabId } = getSet(VIEW_AREA_ID);

    expect(tabs).toHaveLength(1);
    expect(tabs[0].id).toBe(first);
    expect(activeTabId).toBe(first);
  });

  it('can close the last tab, leaving none active', () => {
    newTab(VIEW_AREA_ID);

    closeTab(VIEW_AREA_ID, getSet(VIEW_AREA_ID).activeTabId!);

    const { tabs, activeTabId } = getSet(VIEW_AREA_ID);

    expect(tabs).toHaveLength(0);
    expect(activeTabId).toBeNull();
  });
});
