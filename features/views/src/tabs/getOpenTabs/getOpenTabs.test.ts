import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SetViewAreaEventData } from '@minddrop/views';
import { TabSetsStore } from '../TabSetsStore';
import { newTab } from '../newTab';
import { recordViewArea } from '../recordViewArea';
import { getOpenTabs } from './getOpenTabs';

const VIEW_AREA_ID = 'test-set';

function state(
  main: SetViewAreaEventData['main'],
  split: SetViewAreaEventData['split'] = null,
  splitRatio = 50,
): SetViewAreaEventData {
  return { viewAreaId: VIEW_AREA_ID, main, split, splitRatio };
}

describe('getOpenTabs', () => {
  beforeEach(() => {
    TabSetsStore.clear();
  });

  afterEach(() => {
    TabSetsStore.clear();
  });

  it('returns main and split views across tabs', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(
      VIEW_AREA_ID,
      state({ view: 'db:view', id: 'db:a' }, { view: 'db:entry', id: 'db:b' }),
    );
    newTab(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:c' }));

    const tabs = getOpenTabs();

    expect(tabs.map((tabView) => tabView.id)).toEqual(['db:a', 'db:b', 'db:c']);
  });

  it('filters by view type', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(
      VIEW_AREA_ID,
      state({ view: 'db:view', id: 'db:a' }, { view: 'db:entry', id: 'db:b' }),
    );

    const tabs = getOpenTabs('db:entry');

    expect(tabs.map((tabView) => tabView.id)).toEqual(['db:b']);
  });

  it('returns an empty array when no tabs are open', () => {
    expect(getOpenTabs()).toEqual([]);
  });

  it('ignores sets without tabs', () => {
    // A hydrated set may lack the tabs array entirely
    TabSetsStore.load([{ id: 'tabless-set' } as never]);

    expect(getOpenTabs()).toEqual([]);
  });
});
