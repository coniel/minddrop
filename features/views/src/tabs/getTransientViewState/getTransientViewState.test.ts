import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TabSetsStore } from '../TabSetsStore';
import { getSet } from '../getSet';
import { newTab } from '../newTab';
import { setTransientViewState } from '../setTransientViewState';
import { getTransientViewState } from './getTransientViewState';

const VIEW_AREA_ID = 'test-set';

describe('getTransientViewState', () => {
  beforeEach(() => {
    TabSetsStore.clear();
  });

  afterEach(() => {
    TabSetsStore.clear();
  });

  it('returns the stored value', () => {
    newTab(VIEW_AREA_ID);

    const tab = getSet(VIEW_AREA_ID).tabs[0];

    setTransientViewState(VIEW_AREA_ID, tab.id, 'main', 'scroll', 120);

    expect(getTransientViewState(VIEW_AREA_ID, tab.id, 'main', 'scroll')).toBe(
      120,
    );
  });

  it('returns undefined for a missing key', () => {
    newTab(VIEW_AREA_ID);

    const tab = getSet(VIEW_AREA_ID).tabs[0];

    expect(
      getTransientViewState(VIEW_AREA_ID, tab.id, 'main', 'scroll'),
    ).toBeUndefined();
  });

  it('returns undefined for a tab without a state bag', () => {
    newTab(VIEW_AREA_ID);

    // Strip the state bag to mimic a tab hydrated from older disk data
    const set = getSet(VIEW_AREA_ID);
    const { viewState, ...hydratedTab } = set.tabs[0];

    TabSetsStore.set({ ...set, tabs: [hydratedTab] });

    expect(
      getTransientViewState(VIEW_AREA_ID, hydratedTab.id, 'main', 'scroll'),
    ).toBeUndefined();
  });

  it('returns undefined for an unknown tab', () => {
    expect(
      getTransientViewState(VIEW_AREA_ID, 'tab_unknown', 'main', 'scroll'),
    ).toBeUndefined();
  });
});
