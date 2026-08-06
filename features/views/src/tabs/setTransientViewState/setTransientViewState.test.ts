import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TabSetsStore } from '../TabSetsStore';
import { getSet } from '../getSet';
import { newTab } from '../newTab';
import { setTransientViewState } from './setTransientViewState';

const VIEW_AREA_ID = 'test-set';

describe('setTransientViewState', () => {
  beforeEach(() => {
    TabSetsStore.clear();
  });

  afterEach(() => {
    TabSetsStore.clear();
  });

  it('stores the value under the pane and key', () => {
    newTab(VIEW_AREA_ID);

    const tab = getSet(VIEW_AREA_ID).tabs[0];

    setTransientViewState(VIEW_AREA_ID, tab.id, 'main', 'scroll', 120);

    expect(getSet(VIEW_AREA_ID).tabs[0].viewState?.main?.scroll).toBe(120);
  });

  it('creates missing state bags on tabs hydrated without them', () => {
    newTab(VIEW_AREA_ID);

    // Strip the state bag to mimic a tab hydrated from older disk data
    const set = getSet(VIEW_AREA_ID);
    const { viewState, ...hydratedTab } = set.tabs[0];

    TabSetsStore.set({ ...set, tabs: [hydratedTab] });

    setTransientViewState(VIEW_AREA_ID, hydratedTab.id, 'main', 'scroll', 120);

    expect(getSet(VIEW_AREA_ID).tabs[0].viewState?.main?.scroll).toBe(120);
  });

  it('removes the key when the value is undefined', () => {
    newTab(VIEW_AREA_ID);

    const tab = getSet(VIEW_AREA_ID).tabs[0];

    setTransientViewState(VIEW_AREA_ID, tab.id, 'main', 'scroll', 120);
    setTransientViewState(VIEW_AREA_ID, tab.id, 'main', 'scroll', undefined);

    expect(getSet(VIEW_AREA_ID).tabs[0].viewState?.main).toEqual({});
  });

  it('keeps the main and split bags independent', () => {
    newTab(VIEW_AREA_ID);

    const tab = getSet(VIEW_AREA_ID).tabs[0];

    setTransientViewState(VIEW_AREA_ID, tab.id, 'main', 'scroll', 120);
    setTransientViewState(VIEW_AREA_ID, tab.id, 'split', 'scroll', 40);

    const { viewState } = getSet(VIEW_AREA_ID).tabs[0];

    expect(viewState?.main?.scroll).toBe(120);
    expect(viewState?.split?.scroll).toBe(40);
  });

  it('leaves other tabs untouched', () => {
    newTab(VIEW_AREA_ID);
    newTab(VIEW_AREA_ID);

    const [firstTab, secondTab] = getSet(VIEW_AREA_ID).tabs;

    setTransientViewState(VIEW_AREA_ID, secondTab.id, 'main', 'scroll', 120);

    expect(getSet(VIEW_AREA_ID).tabs[0]).toEqual(firstTab);
  });

  it('does nothing for an unknown tab id', () => {
    newTab(VIEW_AREA_ID);

    const setBefore = getSet(VIEW_AREA_ID);

    setTransientViewState(VIEW_AREA_ID, 'tab_unknown', 'main', 'scroll', 120);

    expect(getSet(VIEW_AREA_ID)).toEqual(setBefore);
  });
});
