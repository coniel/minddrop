import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TabSetsStore } from '../TabSetsStore';
import { getSet } from '../getSet';
import { newTab } from '../newTab';
import { updateTab } from '../updateTab';
import { duplicateTab } from './duplicateTab';

const VIEW_AREA_ID = 'test-set';

const view = {
  view: 'test:view',
  icon: 'test-icon',
  title: 'Test view',
};

describe('duplicateTab', () => {
  beforeEach(() => {
    TabSetsStore.clear();
  });

  afterEach(() => {
    TabSetsStore.clear();
  });

  it('inserts a copy after the tab and makes it active', () => {
    newTab(VIEW_AREA_ID);
    const first = getSet(VIEW_AREA_ID).activeTabId!;
    updateTab(VIEW_AREA_ID, first, { main: view });
    newTab(VIEW_AREA_ID);
    const second = getSet(VIEW_AREA_ID).activeTabId!;

    duplicateTab(VIEW_AREA_ID, first);

    const { tabs, activeTabId } = getSet(VIEW_AREA_ID);

    expect(tabs).toHaveLength(3);
    expect(tabs[0].id).toBe(first);
    expect(tabs[2].id).toBe(second);
    expect(tabs[1].id).not.toBe(first);
    expect(tabs[1].main).toEqual(view);
    expect(activeTabId).toBe(tabs[1].id);
  });

  it('does nothing when the tab does not exist', () => {
    newTab(VIEW_AREA_ID);

    duplicateTab(VIEW_AREA_ID, 'missing');

    expect(getSet(VIEW_AREA_ID).tabs).toHaveLength(1);
  });
});
