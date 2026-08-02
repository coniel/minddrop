import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TabSetsStore } from '../TabSetsStore';
import { getSet } from '../getSet';
import { newTab } from '../newTab';
import { closeTab } from './closeTab';

const SET_ID = 'test-set';

describe('closeTab', () => {
  beforeEach(() => {
    TabSetsStore.clear();
  });

  afterEach(() => {
    TabSetsStore.clear();
  });

  it('removes the tab and activates a neighbour', () => {
    newTab(SET_ID);
    const first = getSet(SET_ID).activeTabId;
    newTab(SET_ID);
    const second = getSet(SET_ID).activeTabId!;

    closeTab(SET_ID, second);

    const { tabs, activeTabId } = getSet(SET_ID);

    expect(tabs).toHaveLength(1);
    expect(tabs[0].id).toBe(first);
    expect(activeTabId).toBe(first);
  });

  it('can close the last tab, leaving none active', () => {
    newTab(SET_ID);

    closeTab(SET_ID, getSet(SET_ID).activeTabId!);

    const { tabs, activeTabId } = getSet(SET_ID);

    expect(tabs).toHaveLength(0);
    expect(activeTabId).toBeNull();
  });
});
