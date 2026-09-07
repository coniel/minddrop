import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ViewSessionsStore } from '../ViewSessionsStore';
import { createViewSession } from '../createViewSession';
import { getViewSessionSet } from '../getViewSessionSet';
import { setTransientViewState } from '../setTransientViewState';
import { getTransientViewState } from './getTransientViewState';

const VIEW_AREA_ID = 'test-set';

describe('getTransientViewState', () => {
  beforeEach(() => {
    ViewSessionsStore.clear();
  });

  afterEach(() => {
    ViewSessionsStore.clear();
  });

  it('returns the stored value', () => {
    createViewSession(VIEW_AREA_ID);

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    setTransientViewState(VIEW_AREA_ID, session.id, 'main', 'scroll', 120);

    expect(
      getTransientViewState(VIEW_AREA_ID, session.id, 'main', 'scroll'),
    ).toBe(120);
  });

  it('returns undefined for a missing key', () => {
    createViewSession(VIEW_AREA_ID);

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    expect(
      getTransientViewState(VIEW_AREA_ID, session.id, 'main', 'scroll'),
    ).toBeUndefined();
  });

  it('returns undefined for a session without a state bag', () => {
    createViewSession(VIEW_AREA_ID);

    // Strip the state bag to mimic a session hydrated from older disk data
    const set = getViewSessionSet(VIEW_AREA_ID);
    const { viewState, ...hydratedSession } = set.sessions[0];

    ViewSessionsStore.set({ ...set, sessions: [hydratedSession] });

    expect(
      getTransientViewState(VIEW_AREA_ID, hydratedSession.id, 'main', 'scroll'),
    ).toBeUndefined();
  });

  it('returns undefined for an unknown session', () => {
    expect(
      getTransientViewState(VIEW_AREA_ID, 'session_unknown', 'main', 'scroll'),
    ).toBeUndefined();
  });
});
