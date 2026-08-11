import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TabSetsStore } from '../TabSetsStore';
import { getSet } from '../getSet';
import { newTab } from '../newTab';
import { setActiveTab } from '../setActiveTab';
import { splitTab } from './splitTab';

const VIEW_AREA_ID = 'test-set';

const view = {
  view: 'test:view',
  icon: 'test-icon',
};

describe('splitTab', () => {
  beforeEach(() => {
    TabSetsStore.clear();
  });

  afterEach(() => {
    TabSetsStore.clear();
  });

  it('opens the view in the split pane and activates the tab', () => {
    newTab(VIEW_AREA_ID);
    const first = getSet(VIEW_AREA_ID).activeTabId!;
    newTab(VIEW_AREA_ID);
    const second = getSet(VIEW_AREA_ID).activeTabId!;

    setActiveTab(VIEW_AREA_ID, second);
    splitTab(VIEW_AREA_ID, first, view);

    const { tabs, activeTabId } = getSet(VIEW_AREA_ID);

    expect(tabs[0].split).toEqual(view);
    expect(tabs[1].split).toBeNull();
    expect(activeTabId).toBe(first);
  });

  it('does nothing when the tab does not exist', () => {
    newTab(VIEW_AREA_ID);

    splitTab(VIEW_AREA_ID, 'missing', view);

    expect(getSet(VIEW_AREA_ID).tabs[0].split).toBeNull();
  });
});
