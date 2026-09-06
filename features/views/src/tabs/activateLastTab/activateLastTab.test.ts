import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TabSetsStore } from '../TabSetsStore';
import { getSet } from '../getSet';
import { newTab } from '../newTab';
import { setActiveTab } from '../setActiveTab';
import { activateLastTab } from './activateLastTab';

const VIEW_AREA_ID = 'test-set';

describe('activateLastTab', () => {
  beforeEach(() => {
    TabSetsStore.clear();
  });

  afterEach(() => {
    TabSetsStore.clear();
  });

  it('activates the last tab in the set', () => {
    newTab(VIEW_AREA_ID);
    const first = getSet(VIEW_AREA_ID).activeTabId!;
    newTab(VIEW_AREA_ID);
    const last = getSet(VIEW_AREA_ID).activeTabId!;
    setActiveTab(VIEW_AREA_ID, first);

    activateLastTab(VIEW_AREA_ID);

    expect(getSet(VIEW_AREA_ID).activeTabId).toBe(last);
  });

  it('does nothing when the set has no tabs', () => {
    activateLastTab(VIEW_AREA_ID);

    expect(getSet(VIEW_AREA_ID).activeTabId).toBeNull();
  });
});
