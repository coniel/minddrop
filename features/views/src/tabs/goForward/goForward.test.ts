import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SetViewAreaEventData } from '@minddrop/events';
import { TabSetsStore } from '../TabSetsStore';
import { getSet } from '../getSet';
import { goBack } from '../goBack';
import { newTab } from '../newTab';
import { recordViewArea } from '../recordViewArea';
import { setTransientViewState } from '../setTransientViewState';
import { goForward } from './goForward';

const VIEW_AREA_ID = 'test-set';

function state(
  main: SetViewAreaEventData['main'],
  split: SetViewAreaEventData['split'] = null,
  splitRatio = 50,
): SetViewAreaEventData {
  return { viewAreaId: VIEW_AREA_ID, main, split, splitRatio };
}

describe('goForward', () => {
  beforeEach(() => {
    TabSetsStore.clear();
  });

  afterEach(() => {
    TabSetsStore.clear();
  });

  it('restores the state navigated back from', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));
    goBack(VIEW_AREA_ID);

    goForward(VIEW_AREA_ID);

    const tab = getSet(VIEW_AREA_ID).tabs[0];

    expect(tab.main?.id).toBe('db:b');
    // The first entry is the search view the tab was opened on
    expect(tab.backHistory).toHaveLength(2);
    expect(tab.backHistory?.[1].main?.id).toBe('db:a');
    expect(tab.forwardHistory).toHaveLength(0);
  });

  it('does nothing without forward history', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));

    goForward(VIEW_AREA_ID);

    const tab = getSet(VIEW_AREA_ID).tabs[0];

    expect(tab.main?.id).toBe('db:a');
    // Only the search view the tab was opened on was pushed
    expect(tab.backHistory).toHaveLength(1);
  });

  it('does nothing without an active tab', () => {
    goForward(VIEW_AREA_ID);

    expect(getSet(VIEW_AREA_ID).tabs).toHaveLength(0);
  });

  it('cannot go forward after a new navigation', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));
    goBack(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:c' }));

    goForward(VIEW_AREA_ID);

    expect(getSet(VIEW_AREA_ID).tabs[0].main?.id).toBe('db:c');
  });

  it('restores the transient state from the history entry', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));

    const tab = getSet(VIEW_AREA_ID).tabs[0];

    // Record state onto the current view, then navigate back so the
    // forward entry carries it
    setTransientViewState(VIEW_AREA_ID, tab.id, 'main', 'scroll', 40);
    goBack(VIEW_AREA_ID);

    goForward(VIEW_AREA_ID);

    expect(getSet(VIEW_AREA_ID).tabs[0].viewState?.main?.scroll).toBe(40);
  });
});
