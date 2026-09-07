import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SetViewAreaEventData } from '../../events';
import { ViewSessionsStore } from '../ViewSessionsStore';
import { createViewSession } from '../createViewSession';
import { getViewSessionSet } from '../getViewSessionSet';
import { goBack } from '../goBack';
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
    ViewSessionsStore.clear();
  });

  afterEach(() => {
    ViewSessionsStore.clear();
  });

  it('restores the state navigated back from', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));
    goBack(VIEW_AREA_ID);

    goForward(VIEW_AREA_ID);

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    expect(session.main?.id).toBe('db:b');
    // The first entry is the search view the session was opened on
    expect(session.backHistory).toHaveLength(2);
    expect(session.backHistory?.[1].main?.id).toBe('db:a');
    expect(session.forwardHistory).toHaveLength(0);
  });

  it('does nothing without forward history', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));

    goForward(VIEW_AREA_ID);

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    expect(session.main?.id).toBe('db:a');
    // Only the search view the session was opened on was pushed
    expect(session.backHistory).toHaveLength(1);
  });

  it('does nothing without an active session', () => {
    goForward(VIEW_AREA_ID);

    expect(getViewSessionSet(VIEW_AREA_ID).sessions).toHaveLength(0);
  });

  it('cannot go forward after a new navigation', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));
    goBack(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:c' }));

    goForward(VIEW_AREA_ID);

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0].main?.id).toBe('db:c');
  });

  it('restores the transient state from the history entry', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    // Record state onto the current view, then navigate back so the
    // forward entry carries it.
    setTransientViewState(VIEW_AREA_ID, session.id, 'main', 'scroll', 40);
    goBack(VIEW_AREA_ID);

    goForward(VIEW_AREA_ID);

    expect(
      getViewSessionSet(VIEW_AREA_ID).sessions[0].viewState?.main?.scroll,
    ).toBe(40);
  });
});
