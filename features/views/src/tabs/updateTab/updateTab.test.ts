import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TabSetsStore } from '../TabSetsStore';
import { getSet } from '../getSet';
import { newTab } from '../newTab';
import { updateTab } from './updateTab';

const VIEW_AREA_ID = 'test-set';

describe('updateTab', () => {
  beforeEach(() => {
    TabSetsStore.clear();
  });

  afterEach(() => {
    TabSetsStore.clear();
  });

  it('merges the changes onto the target tab', () => {
    newTab(VIEW_AREA_ID);

    const tab = getSet(VIEW_AREA_ID).tabs[0];

    updateTab(VIEW_AREA_ID, tab.id, { splitRatio: 70 });

    expect(getSet(VIEW_AREA_ID).tabs[0].splitRatio).toBe(70);
  });

  it('leaves other tabs untouched', () => {
    newTab(VIEW_AREA_ID);
    newTab(VIEW_AREA_ID);

    const [firstTab, secondTab] = getSet(VIEW_AREA_ID).tabs;

    updateTab(VIEW_AREA_ID, secondTab.id, { splitRatio: 70 });

    expect(getSet(VIEW_AREA_ID).tabs[0]).toEqual(firstTab);
  });

  it('does nothing for an unknown tab id', () => {
    newTab(VIEW_AREA_ID);

    const setBefore = getSet(VIEW_AREA_ID);

    updateTab(VIEW_AREA_ID, 'tab_unknown', { splitRatio: 70 });

    expect(getSet(VIEW_AREA_ID)).toEqual(setBefore);
  });
});
