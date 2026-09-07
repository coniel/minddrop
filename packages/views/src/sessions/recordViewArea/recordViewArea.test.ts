import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MaxHistoryLength } from '../../constants';
import { SetViewAreaEventData } from '../../events';
import { ViewSessionsStore } from '../ViewSessionsStore';
import { createViewSession } from '../createViewSession';
import { getViewSessionSet } from '../getViewSessionSet';
import { goBack } from '../goBack';
import { setSlot } from '../setSlot';
import { setTransientViewState } from '../setTransientViewState';
import { updateViewSession } from '../updateViewSession';
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
    ViewSessionsStore.clear();
  });

  afterEach(() => {
    ViewSessionsStore.clear();
  });

  it('records the main view onto the active session', () => {
    createViewSession(VIEW_AREA_ID);

    recordViewArea(VIEW_AREA_ID, state({ view: 'designs:view:studio' }));

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0].main?.view).toBe(
      'designs:view:studio',
    );
  });

  it('clears the split when recording a state without one', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'a' }, { view: 'b' }, 60));
    recordViewArea(VIEW_AREA_ID, state({ view: 'a' }));

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0].split).toBeNull();
  });

  it('creates an active session when none exists', () => {
    recordViewArea(VIEW_AREA_ID, state({ view: 'a' }));

    const { sessions, activeSessionId } = getViewSessionSet(VIEW_AREA_ID);

    expect(sessions).toHaveLength(1);
    expect(activeSessionId).not.toBeNull();
  });

  it('pushes the previous state onto the back history on navigation', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));

    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    // The first entry is the search view the session was opened on
    expect(session.backHistory).toHaveLength(2);
    expect(session.backHistory?.[1].main?.id).toBe('db:a');
  });

  it('pushes the previous state when only the split changes', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));

    recordViewArea(
      VIEW_AREA_ID,
      state({ view: 'db:view', id: 'db:a' }, { view: 'db:view', id: 'db:b' }),
    );

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    // The first entry is the search view the session was opened on
    expect(session.backHistory).toHaveLength(2);
    expect(session.backHistory?.[1].split).toBeNull();
  });

  it('does not push when navigating away from a viewless session', () => {
    createViewSession(VIEW_AREA_ID);

    // Empty the session's main pane, as closing it does
    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    updateViewSession(VIEW_AREA_ID, session.id, { main: null });

    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));

    expect(
      getViewSessionSet(VIEW_AREA_ID).sessions[0].backHistory,
    ).toHaveLength(0);
  });

  it('does not push when the state replays the current views', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));

    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));

    // Only the search view and db:a were pushed
    expect(
      getViewSessionSet(VIEW_AREA_ID).sessions[0].backHistory,
    ).toHaveLength(2);
  });

  it('does not push when only the split ratio changes', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'a' }, { view: 'b' }, 50));

    recordViewArea(VIEW_AREA_ID, state({ view: 'a' }, { view: 'b' }, 70));

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    // Only the search view the session was opened on was pushed
    expect(session.backHistory).toHaveLength(1);
    expect(session.splitRatio).toBe(70);
  });

  it('does not push when only display metadata changes', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(
      VIEW_AREA_ID,
      state({ view: 'db:view', id: 'db:a', title: 'Old' }),
    );

    recordViewArea(
      VIEW_AREA_ID,
      state({ view: 'db:view', id: 'db:a', title: 'New' }),
    );

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    // Only the search view the session was opened on was pushed
    expect(session.backHistory).toHaveLength(1);
    expect(session.main?.title).toBe('New');
  });

  it('records a replaced subview label without pushing', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(
      VIEW_AREA_ID,
      state({
        view: 'db:view',
        id: 'db:a',
        subview: { id: 'designs', title: 'Designs' },
      }),
    );

    recordViewArea(VIEW_AREA_ID, {
      ...state({
        view: 'db:view',
        id: 'db:a',
        subview: { id: 'designs', title: 'Designs', label: 'Card' },
      }),
      replace: true,
    });

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    // Only the search view the session was opened on was pushed
    expect(session.backHistory).toHaveLength(1);
    expect(session.main?.subview?.label).toBe('Card');
  });

  it('clears the forward history on navigation', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));
    goBack(VIEW_AREA_ID);

    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:c' }));

    expect(
      getViewSessionSet(VIEW_AREA_ID).sessions[0].forwardHistory,
    ).toHaveLength(0);
  });

  it('preserves the forward history when replaying the current state', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));
    goBack(VIEW_AREA_ID);

    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));

    expect(
      getViewSessionSet(VIEW_AREA_ID).sessions[0].forwardHistory,
    ).toHaveLength(1);
  });

  it('caps the back history length', () => {
    createViewSession(VIEW_AREA_ID);

    // Navigate more times than the history holds
    for (let index = 0; index < MaxHistoryLength + 5; index += 1) {
      recordViewArea(
        VIEW_AREA_ID,
        state({ view: 'db:view', id: `db:${index}` }),
      );
    }

    expect(
      getViewSessionSet(VIEW_AREA_ID).sessions[0].backHistory,
    ).toHaveLength(MaxHistoryLength);
  });

  it('preserves the transient state when replaying the current state', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'a' }, { view: 'b' }, 50));

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    setTransientViewState(VIEW_AREA_ID, session.id, 'main', 'scroll', 120);

    const viewStateBefore =
      getViewSessionSet(VIEW_AREA_ID).sessions[0].viewState;

    recordViewArea(VIEW_AREA_ID, state({ view: 'a' }, { view: 'b' }, 70));

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0].viewState).toBe(
      viewStateBefore,
    );
  });

  it('resets only the transient state of the pane that navigated', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'a' }, { view: 'b' }));

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    setTransientViewState(VIEW_AREA_ID, session.id, 'main', 'scroll', 120);
    setTransientViewState(VIEW_AREA_ID, session.id, 'split', 'scroll', 40);

    // Navigate only the split pane
    recordViewArea(VIEW_AREA_ID, state({ view: 'a' }, { view: 'c' }));

    const { viewState } = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    expect(viewState?.main?.scroll).toBe(120);
    expect(viewState?.split).toEqual({});
  });

  it('preserves the main transient state when opening a split', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'a' }));

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    setTransientViewState(VIEW_AREA_ID, session.id, 'main', 'scroll', 120);

    recordViewArea(VIEW_AREA_ID, state({ view: 'a' }, { view: 'b' }));

    expect(
      getViewSessionSet(VIEW_AREA_ID).sessions[0].viewState?.main?.scroll,
    ).toBe(120);
  });

  it('snapshots the transient state onto the pushed history entry', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    setTransientViewState(VIEW_AREA_ID, session.id, 'main', 'scroll', 120);

    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));

    const updatedSession = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    expect(updatedSession.backHistory?.[1].viewState?.main?.scroll).toBe(120);
    expect(updatedSession.viewState?.main).toEqual({});
  });

  it('resets the slot state when the main pane navigates', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    setSlot(VIEW_AREA_ID, session.id, 'sidebar', { fill: 'test:fill' });

    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));

    const updatedSession = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    expect(updatedSession.slots).toEqual({});
    expect(updatedSession.backHistory?.[1].slots).toEqual({
      sidebar: { fill: 'test:fill' },
    });
  });

  it('preserves the slot state when only the subview changes', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    setSlot(VIEW_AREA_ID, session.id, 'sidebar', { fill: 'test:fill' });

    recordViewArea(
      VIEW_AREA_ID,
      state({ view: 'db:view', id: 'db:a', subview: { id: 'entry:a' } }),
    );

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0].slots).toEqual({
      sidebar: { fill: 'test:fill' },
    });
  });

  it('preserves the slot state when opening a split', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'a' }));

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    setSlot(VIEW_AREA_ID, session.id, 'sidebar', { fill: 'test:fill' });

    recordViewArea(VIEW_AREA_ID, state({ view: 'a' }, { view: 'b' }));

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0].slots).toEqual({
      sidebar: { fill: 'test:fill' },
    });
  });
});
