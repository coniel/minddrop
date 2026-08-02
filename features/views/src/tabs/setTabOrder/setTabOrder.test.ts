import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TabSetsStore } from '../TabSetsStore';
import { getSet } from '../getSet';
import { newTab } from '../newTab';
import { setTabOrder } from './setTabOrder';

const SET_ID = 'test-set';

describe('setTabOrder', () => {
  beforeEach(() => {
    TabSetsStore.clear();
  });

  afterEach(() => {
    TabSetsStore.clear();
  });

  it('reorders the tabs to match the given ids', () => {
    newTab(SET_ID);
    const first = getSet(SET_ID).tabs[0].id;
    newTab(SET_ID);
    const second = getSet(SET_ID).tabs[1].id;

    setTabOrder(SET_ID, [second, first]);

    const { tabs } = getSet(SET_ID);

    expect(tabs[0].id).toBe(second);
    expect(tabs[1].id).toBe(first);
  });
});
