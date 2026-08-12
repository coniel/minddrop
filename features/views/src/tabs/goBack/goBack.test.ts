import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DefaultViewName, SetViewAreaEventData } from '@minddrop/events';
import { TabSetsStore } from '../TabSetsStore';
import { getSet } from '../getSet';
import { newTab } from '../newTab';
import { recordViewArea } from '../recordViewArea';
import { setTransientViewState } from '../setTransientViewState';
import { goBack } from './goBack';

const VIEW_AREA_ID = 'test-set';

function state(
  main: SetViewAreaEventData['main'],
  split: SetViewAreaEventData['split'] = null,
  splitRatio = 50,
): SetViewAreaEventData {
  return { viewAreaId: VIEW_AREA_ID, main, split, splitRatio };
}

describe('goBack', () => {
  beforeEach(() => {
    TabSetsStore.clear();
  });

  afterEach(() => {
    TabSetsStore.clear();
  });

  it('restores the previous state onto the active tab', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));

    goBack(VIEW_AREA_ID);

    const tab = getSet(VIEW_AREA_ID).tabs[0];

    expect(tab.main?.id).toBe('db:a');
    // The search view the tab was opened on remains behind db:a
    expect(tab.backHistory).toHaveLength(1);
    expect(tab.forwardHistory).toHaveLength(1);
    expect(tab.forwardHistory?.[0].main?.id).toBe('db:b');
  });

  it('does nothing without back history', () => {
    newTab(VIEW_AREA_ID);

    goBack(VIEW_AREA_ID);

    const tab = getSet(VIEW_AREA_ID).tabs[0];

    expect(tab.main?.view).toBe(DefaultViewName);
    expect(tab.forwardHistory).toHaveLength(0);
  });

  it('does nothing without an active tab', () => {
    goBack(VIEW_AREA_ID);

    expect(getSet(VIEW_AREA_ID).tabs).toHaveLength(0);
  });

  it('restores a split arrangement', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(
      VIEW_AREA_ID,
      state(
        { view: 'db:view', id: 'db:a' },
        { view: 'db:view', id: 'db:b' },
        60,
      ),
    );
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));

    goBack(VIEW_AREA_ID);

    const tab = getSet(VIEW_AREA_ID).tabs[0];

    expect(tab.split?.id).toBe('db:b');
    expect(tab.splitRatio).toBe(60);
  });

  it('does not re-record the restored state as a navigation', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));
    goBack(VIEW_AREA_ID);

    // Simulate the view area confirming the restored state
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));

    const tab = getSet(VIEW_AREA_ID).tabs[0];

    // The search view the tab was opened on remains behind db:a
    expect(tab.backHistory).toHaveLength(1);
    expect(tab.forwardHistory).toHaveLength(1);
  });

  it('restores the transient state from the history entry', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));

    const tab = getSet(VIEW_AREA_ID).tabs[0];

    setTransientViewState(VIEW_AREA_ID, tab.id, 'main', 'scroll', 120);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));
    setTransientViewState(VIEW_AREA_ID, tab.id, 'main', 'scroll', 40);

    goBack(VIEW_AREA_ID);

    const updatedTab = getSet(VIEW_AREA_ID).tabs[0];

    expect(updatedTab.viewState?.main?.scroll).toBe(120);
    expect(updatedTab.forwardHistory?.[0].viewState?.main?.scroll).toBe(40);
  });

  it('defaults to an empty transient state for entries without one', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));

    // Strip the entries' state to mimic history hydrated from older
    // disk data
    const set = getSet(VIEW_AREA_ID);
    const strippedTabs = set.tabs.map((setTab) => ({
      ...setTab,
      backHistory: setTab.backHistory?.map(({ viewState, ...entry }) => entry),
    }));

    TabSetsStore.set({ ...set, tabs: strippedTabs });

    goBack(VIEW_AREA_ID);

    expect(getSet(VIEW_AREA_ID).tabs[0].viewState).toEqual({});
  });
});
