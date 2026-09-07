import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import * as Views from '../../Views';
import { SetViewAreaEventData } from '../../events';
import { ViewSessionsStore } from '../ViewSessionsStore';
import { createViewSession } from '../createViewSession';
import { getViewSessionSet } from '../getViewSessionSet';
import { recordViewArea } from '../recordViewArea';
import { setSlot } from '../setSlot';
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
    ViewSessionsStore.clear();
  });

  afterEach(() => {
    ViewSessionsStore.clear();
  });

  it('restores the previous state onto the active session', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));

    goBack(VIEW_AREA_ID);

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    expect(session.main?.id).toBe('db:a');
    // The search view the session was opened on remains behind db:a
    expect(session.backHistory).toHaveLength(1);
    expect(session.forwardHistory).toHaveLength(1);
    expect(session.forwardHistory?.[0].main?.id).toBe('db:b');
  });

  it('navigates back through multiple entries', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:c' }));

    goBack(VIEW_AREA_ID, 2);

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    expect(session.main?.id).toBe('db:a');
    // The entries navigated past are forward of the restored state,
    // nearest last
    expect(session.forwardHistory?.map((entry) => entry.main?.id)).toEqual([
      'db:c',
      'db:b',
    ]);
  });

  it('clamps the steps to the available history', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));

    goBack(VIEW_AREA_ID, 10);

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    // The search view the session was opened on is the furthest entry
    expect(session.main?.view).toBe(Views.constants.DefaultName);
    expect(session.backHistory).toHaveLength(0);
  });

  it('does nothing without back history', () => {
    createViewSession(VIEW_AREA_ID);

    goBack(VIEW_AREA_ID);

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    expect(session.main?.view).toBe(Views.constants.DefaultName);
    expect(session.forwardHistory).toHaveLength(0);
  });

  it('does nothing without an active session', () => {
    goBack(VIEW_AREA_ID);

    expect(getViewSessionSet(VIEW_AREA_ID).sessions).toHaveLength(0);
  });

  it('restores a split arrangement', () => {
    createViewSession(VIEW_AREA_ID);
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

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    expect(session.split?.id).toBe('db:b');
    expect(session.splitRatio).toBe(60);
  });

  it('does not re-record the restored state as a navigation', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));
    goBack(VIEW_AREA_ID);

    // Simulate the view area confirming the restored state
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    // The search view the session was opened on remains behind db:a
    expect(session.backHistory).toHaveLength(1);
    expect(session.forwardHistory).toHaveLength(1);
  });

  it('restores the transient state from the history entry', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    setTransientViewState(VIEW_AREA_ID, session.id, 'main', 'scroll', 120);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));
    setTransientViewState(VIEW_AREA_ID, session.id, 'main', 'scroll', 40);

    goBack(VIEW_AREA_ID);

    const updatedSession = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    expect(updatedSession.viewState?.main?.scroll).toBe(120);
    expect(updatedSession.forwardHistory?.[0].viewState?.main?.scroll).toBe(40);
  });

  it('restores the slot state from the history entry', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    setSlot(VIEW_AREA_ID, session.id, 'sidebar', { hidden: true });
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));
    setSlot(VIEW_AREA_ID, session.id, 'sidebar', { fill: 'test:fill' });

    goBack(VIEW_AREA_ID);

    const updatedSession = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    expect(updatedSession.slots).toEqual({ sidebar: { hidden: true } });
    expect(updatedSession.forwardHistory?.[0].slots).toEqual({
      sidebar: { fill: 'test:fill' },
    });
  });

  it('defaults to an empty transient state for entries without one', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));

    // Strip the entries' state to mimic history hydrated from older
    // disk data.
    const set = getViewSessionSet(VIEW_AREA_ID);
    const strippedSessions = set.sessions.map((setSession) => ({
      ...setSession,
      backHistory: setSession.backHistory?.map(
        ({ viewState, ...entry }) => entry,
      ),
    }));

    ViewSessionsStore.set({ ...set, sessions: strippedSessions });

    goBack(VIEW_AREA_ID);

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0].viewState).toEqual({});
  });
});
