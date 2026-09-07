import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ViewSessionsStore } from '../ViewSessionsStore';
import { createViewSession } from '../createViewSession';
import { getViewSessionSet } from '../getViewSessionSet';
import { setTransientViewState } from './setTransientViewState';

const VIEW_AREA_ID = 'test-set';

describe('setTransientViewState', () => {
  beforeEach(() => {
    ViewSessionsStore.clear();
  });

  afterEach(() => {
    ViewSessionsStore.clear();
  });

  it('stores the value under the pane and key', () => {
    createViewSession(VIEW_AREA_ID);

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    setTransientViewState(VIEW_AREA_ID, session.id, 'main', 'scroll', 120);

    expect(
      getViewSessionSet(VIEW_AREA_ID).sessions[0].viewState?.main?.scroll,
    ).toBe(120);
  });

  it('creates missing state bags on sessions hydrated without them', () => {
    createViewSession(VIEW_AREA_ID);

    // Strip the state bag to mimic a session hydrated from older disk data
    const set = getViewSessionSet(VIEW_AREA_ID);
    const { viewState, ...hydratedSession } = set.sessions[0];

    ViewSessionsStore.set({ ...set, sessions: [hydratedSession] });

    setTransientViewState(
      VIEW_AREA_ID,
      hydratedSession.id,
      'main',
      'scroll',
      120,
    );

    expect(
      getViewSessionSet(VIEW_AREA_ID).sessions[0].viewState?.main?.scroll,
    ).toBe(120);
  });

  it('removes the key when the value is undefined', () => {
    createViewSession(VIEW_AREA_ID);

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    setTransientViewState(VIEW_AREA_ID, session.id, 'main', 'scroll', 120);
    setTransientViewState(
      VIEW_AREA_ID,
      session.id,
      'main',
      'scroll',
      undefined,
    );

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0].viewState?.main).toEqual(
      {},
    );
  });

  it('keeps the main and split bags independent', () => {
    createViewSession(VIEW_AREA_ID);

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    setTransientViewState(VIEW_AREA_ID, session.id, 'main', 'scroll', 120);
    setTransientViewState(VIEW_AREA_ID, session.id, 'split', 'scroll', 40);

    const { viewState } = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    expect(viewState?.main?.scroll).toBe(120);
    expect(viewState?.split?.scroll).toBe(40);
  });

  it('leaves other sessions untouched', () => {
    createViewSession(VIEW_AREA_ID);
    createViewSession(VIEW_AREA_ID);

    const [firstSession, secondSession] =
      getViewSessionSet(VIEW_AREA_ID).sessions;

    setTransientViewState(
      VIEW_AREA_ID,
      secondSession.id,
      'main',
      'scroll',
      120,
    );

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0]).toEqual(firstSession);
  });

  it('does nothing for an unknown session id', () => {
    createViewSession(VIEW_AREA_ID);

    const setBefore = getViewSessionSet(VIEW_AREA_ID);

    setTransientViewState(
      VIEW_AREA_ID,
      'session_unknown',
      'main',
      'scroll',
      120,
    );

    expect(getViewSessionSet(VIEW_AREA_ID)).toEqual(setBefore);
  });
});
