import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SetViewAreaEventData } from '@minddrop/events';
import { TabSetsStore } from '../TabSetsStore';
import { getSet } from '../getSet';
import { goBack } from '../goBack';
import { newTab } from '../newTab';
import { setTransientViewState } from '../setTransientViewState';
import { MAX_HISTORY_LENGTH } from '../tabsConstants';
import { recordViewArea } from './recordViewArea';

const VIEW_AREA_ID = 'test-set';

function state(
  main: SetViewAreaEventData['main'],
  split: SetViewAreaEventData['split'] = null,
  splitRatio = 50,
): SetViewAreaEventData {
  return { viewAreaId: VIEW_AREA_ID, main, split, splitRatio };
}

describe('recordViewArea', () => {
  beforeEach(() => {
    TabSetsStore.clear();
  });

  afterEach(() => {
    TabSetsStore.clear();
  });

  it('records the main view onto the active tab', () => {
    newTab(VIEW_AREA_ID);

    recordViewArea(VIEW_AREA_ID, state({ view: 'designs:view:studio' }));

    expect(getSet(VIEW_AREA_ID).tabs[0].main?.view).toBe('designs:view:studio');
  });

  it('clears the split when recording a state without one', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'a' }, { view: 'b' }, 60));
    recordViewArea(VIEW_AREA_ID, state({ view: 'a' }));

    expect(getSet(VIEW_AREA_ID).tabs[0].split).toBeNull();
  });

  it('creates an active tab when none exists', () => {
    recordViewArea(VIEW_AREA_ID, state({ view: 'a' }));

    const { tabs, activeTabId } = getSet(VIEW_AREA_ID);

    expect(tabs).toHaveLength(1);
    expect(activeTabId).not.toBeNull();
  });

  it('pushes the previous state onto the back history on navigation', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));

    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));

    const tab = getSet(VIEW_AREA_ID).tabs[0];

    expect(tab.backHistory).toHaveLength(1);
    expect(tab.backHistory?.[0].main?.id).toBe('db:a');
  });

  it('pushes the previous state when only the split changes', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));

    recordViewArea(
      VIEW_AREA_ID,
      state({ view: 'db:view', id: 'db:a' }, { view: 'db:view', id: 'db:b' }),
    );

    const tab = getSet(VIEW_AREA_ID).tabs[0];

    expect(tab.backHistory).toHaveLength(1);
    expect(tab.backHistory?.[0].split).toBeNull();
  });

  it('does not push when navigating away from a blank tab', () => {
    newTab(VIEW_AREA_ID);

    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));

    expect(getSet(VIEW_AREA_ID).tabs[0].backHistory).toHaveLength(0);
  });

  it('does not push when the state replays the current views', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));

    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));

    expect(getSet(VIEW_AREA_ID).tabs[0].backHistory).toHaveLength(1);
  });

  it('does not push when only the split ratio changes', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'a' }, { view: 'b' }, 50));

    recordViewArea(VIEW_AREA_ID, state({ view: 'a' }, { view: 'b' }, 70));

    const tab = getSet(VIEW_AREA_ID).tabs[0];

    expect(tab.backHistory).toHaveLength(0);
    expect(tab.splitRatio).toBe(70);
  });

  it('does not push when only display metadata changes', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(
      VIEW_AREA_ID,
      state({ view: 'db:view', id: 'db:a', title: 'Old' }),
    );

    recordViewArea(
      VIEW_AREA_ID,
      state({ view: 'db:view', id: 'db:a', title: 'New' }),
    );

    const tab = getSet(VIEW_AREA_ID).tabs[0];

    expect(tab.backHistory).toHaveLength(0);
    expect(tab.main?.title).toBe('New');
  });

  it('clears the forward history on navigation', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));
    goBack(VIEW_AREA_ID);

    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:c' }));

    expect(getSet(VIEW_AREA_ID).tabs[0].forwardHistory).toHaveLength(0);
  });

  it('preserves the forward history when replaying the current state', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));
    goBack(VIEW_AREA_ID);

    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));

    expect(getSet(VIEW_AREA_ID).tabs[0].forwardHistory).toHaveLength(1);
  });

  it('caps the back history length', () => {
    newTab(VIEW_AREA_ID);

    // Navigate more times than the history holds
    for (let index = 0; index < MAX_HISTORY_LENGTH + 5; index += 1) {
      recordViewArea(
        VIEW_AREA_ID,
        state({ view: 'db:view', id: `db:${index}` }),
      );
    }

    expect(getSet(VIEW_AREA_ID).tabs[0].backHistory).toHaveLength(
      MAX_HISTORY_LENGTH,
    );
  });

  it('preserves the transient state when replaying the current state', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'a' }, { view: 'b' }, 50));

    const tab = getSet(VIEW_AREA_ID).tabs[0];

    setTransientViewState(VIEW_AREA_ID, tab.id, 'main', 'scroll', 120);

    const viewStateBefore = getSet(VIEW_AREA_ID).tabs[0].viewState;

    recordViewArea(VIEW_AREA_ID, state({ view: 'a' }, { view: 'b' }, 70));

    expect(getSet(VIEW_AREA_ID).tabs[0].viewState).toBe(viewStateBefore);
  });

  it('resets only the transient state of the pane that navigated', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'a' }, { view: 'b' }));

    const tab = getSet(VIEW_AREA_ID).tabs[0];

    setTransientViewState(VIEW_AREA_ID, tab.id, 'main', 'scroll', 120);
    setTransientViewState(VIEW_AREA_ID, tab.id, 'split', 'scroll', 40);

    // Navigate only the split pane
    recordViewArea(VIEW_AREA_ID, state({ view: 'a' }, { view: 'c' }));

    const { viewState } = getSet(VIEW_AREA_ID).tabs[0];

    expect(viewState?.main?.scroll).toBe(120);
    expect(viewState?.split).toEqual({});
  });

  it('preserves the main transient state when opening a split', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'a' }));

    const tab = getSet(VIEW_AREA_ID).tabs[0];

    setTransientViewState(VIEW_AREA_ID, tab.id, 'main', 'scroll', 120);

    recordViewArea(VIEW_AREA_ID, state({ view: 'a' }, { view: 'b' }));

    expect(getSet(VIEW_AREA_ID).tabs[0].viewState?.main?.scroll).toBe(120);
  });

  it('snapshots the transient state onto the pushed history entry', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));

    const tab = getSet(VIEW_AREA_ID).tabs[0];

    setTransientViewState(VIEW_AREA_ID, tab.id, 'main', 'scroll', 120);

    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));

    const updatedTab = getSet(VIEW_AREA_ID).tabs[0];

    expect(updatedTab.backHistory?.[0].viewState?.main?.scroll).toBe(120);
    expect(updatedTab.viewState?.main).toEqual({});
  });
});
