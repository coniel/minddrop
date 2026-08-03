import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TabSetsStore } from '../TabSetsStore';
import { getSet } from '../getSet';
import { newTab } from '../newTab';
import { setTabOrder } from './setTabOrder';

const VIEW_AREA_ID = 'test-set';

describe('setTabOrder', () => {
  beforeEach(() => {
    TabSetsStore.clear();
  });

  afterEach(() => {
    TabSetsStore.clear();
  });

  it('reorders the tabs to match the given ids', () => {
    newTab(VIEW_AREA_ID);
    const first = getSet(VIEW_AREA_ID).tabs[0].id;
    newTab(VIEW_AREA_ID);
    const second = getSet(VIEW_AREA_ID).tabs[1].id;

    setTabOrder(VIEW_AREA_ID, [second, first]);

    const { tabs } = getSet(VIEW_AREA_ID);

    expect(tabs[0].id).toBe(second);
    expect(tabs[1].id).toBe(first);
  });
});
