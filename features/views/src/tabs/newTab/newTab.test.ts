import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TabSetsStore } from '../TabSetsStore';
import { getSet } from '../getSet';
import { newTab } from './newTab';

const SET_ID = 'test-set';

describe('newTab', () => {
  beforeEach(() => {
    TabSetsStore.clear();
  });

  afterEach(() => {
    TabSetsStore.clear();
  });

  it('appends a blank tab and makes it active', () => {
    newTab(SET_ID);

    const { tabs, activeTabId } = getSet(SET_ID);

    expect(tabs).toHaveLength(1);
    expect(tabs[0].main).toBeNull();
    expect(activeTabId).toBe(tabs[0].id);
  });
});
