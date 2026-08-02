import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TabSetsStore } from '../TabSetsStore';
import { getSet } from '../getSet';
import { newTab } from '../newTab';
import { setActiveTab } from './setActiveTab';

const SET_ID = 'test-set';

describe('setActiveTab', () => {
  beforeEach(() => {
    TabSetsStore.clear();
  });

  afterEach(() => {
    TabSetsStore.clear();
  });

  it('activates the given tab', () => {
    newTab(SET_ID);
    const first = getSet(SET_ID).activeTabId!;
    newTab(SET_ID);

    setActiveTab(SET_ID, first);

    expect(getSet(SET_ID).activeTabId).toBe(first);
  });
});
