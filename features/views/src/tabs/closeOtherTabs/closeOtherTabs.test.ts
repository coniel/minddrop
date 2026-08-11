import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TabSetsStore } from '../TabSetsStore';
import { getSet } from '../getSet';
import { newTab } from '../newTab';
import { closeOtherTabs } from './closeOtherTabs';

const VIEW_AREA_ID = 'test-set';

describe('closeOtherTabs', () => {
  beforeEach(() => {
    TabSetsStore.clear();
  });

  afterEach(() => {
    TabSetsStore.clear();
  });

  it('keeps only the given tab and activates it', () => {
    newTab(VIEW_AREA_ID);
    const first = getSet(VIEW_AREA_ID).activeTabId!;
    newTab(VIEW_AREA_ID);
    newTab(VIEW_AREA_ID);

    closeOtherTabs(VIEW_AREA_ID, first);

    const { tabs, activeTabId } = getSet(VIEW_AREA_ID);

    expect(tabs).toHaveLength(1);
    expect(tabs[0].id).toBe(first);
    expect(activeTabId).toBe(first);
  });

  it('does nothing when the tab does not exist', () => {
    newTab(VIEW_AREA_ID);
    newTab(VIEW_AREA_ID);

    closeOtherTabs(VIEW_AREA_ID, 'missing');

    expect(getSet(VIEW_AREA_ID).tabs).toHaveLength(2);
  });
});
