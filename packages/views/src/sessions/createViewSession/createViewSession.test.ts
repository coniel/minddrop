import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import * as Views from '../../Views';
import { ViewSessionsStore } from '../ViewSessionsStore';
import { getViewSessionSet } from '../getViewSessionSet';
import { createViewSession } from './createViewSession';

const VIEW_AREA_ID = 'test-set';

describe('createViewSession', () => {
  beforeEach(() => {
    ViewSessionsStore.clear();
  });

  afterEach(() => {
    ViewSessionsStore.clear();
  });

  it('defaults to the main view area', () => {
    createViewSession();

    expect(
      getViewSessionSet(Views.constants.DefaultAreaId).sessions,
    ).toHaveLength(1);
  });

  it('appends a blank session and makes it active', () => {
    createViewSession(VIEW_AREA_ID);

    const { sessions, activeSessionId } = getViewSessionSet(VIEW_AREA_ID);

    expect(sessions).toHaveLength(1);
    expect(sessions[0].main?.view).toBe(Views.constants.DefaultName);
    expect(activeSessionId).toBe(sessions[0].id);
  });

  it('inserts the session at the given index', () => {
    createViewSession(VIEW_AREA_ID);
    const first = getViewSessionSet(VIEW_AREA_ID).activeSessionId!;

    createViewSession(VIEW_AREA_ID, { index: 0 });

    const { sessions, activeSessionId } = getViewSessionSet(VIEW_AREA_ID);

    expect(sessions.map((session) => session.id)).toEqual([
      activeSessionId,
      first,
    ]);
  });

  it('creates the session with an empty transient state', () => {
    createViewSession(VIEW_AREA_ID);

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0].viewState).toEqual({});
  });
});
