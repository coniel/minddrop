import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TabSetsStore } from '../TabSetsStore';
import { getSet } from '../getSet';
import { newTab } from '../newTab';
import { setActiveTab } from './setActiveTab';

const VIEW_AREA_ID = 'test-set';

describe('setActiveTab', () => {
  beforeEach(() => {
    TabSetsStore.clear();
  });

  afterEach(() => {
    TabSetsStore.clear();
  });

  it('activates the given tab', () => {
    newTab(VIEW_AREA_ID);
    const first = getSet(VIEW_AREA_ID).activeTabId!;
    newTab(VIEW_AREA_ID);

    setActiveTab(VIEW_AREA_ID, first);

    expect(getSet(VIEW_AREA_ID).activeTabId).toBe(first);
  });
});
