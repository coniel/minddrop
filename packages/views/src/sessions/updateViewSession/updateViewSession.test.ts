import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ViewSessionsStore } from '../ViewSessionsStore';
import { createViewSession } from '../createViewSession';
import { getViewSessionSet } from '../getViewSessionSet';
import { updateViewSession } from './updateViewSession';

const VIEW_AREA_ID = 'test-set';

describe('updateViewSession', () => {
  beforeEach(() => {
    ViewSessionsStore.clear();
  });

  afterEach(() => {
    ViewSessionsStore.clear();
  });

  it('merges the changes onto the target session', () => {
    createViewSession(VIEW_AREA_ID);

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    updateViewSession(VIEW_AREA_ID, session.id, { splitRatio: 70 });

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0].splitRatio).toBe(70);
  });

  it('leaves other sessions untouched', () => {
    createViewSession(VIEW_AREA_ID);
    createViewSession(VIEW_AREA_ID);

    const [firstSession, secondSession] =
      getViewSessionSet(VIEW_AREA_ID).sessions;

    updateViewSession(VIEW_AREA_ID, secondSession.id, { splitRatio: 70 });

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0]).toEqual(firstSession);
  });

  it('does nothing for an unknown session id', () => {
    createViewSession(VIEW_AREA_ID);

    const setBefore = getViewSessionSet(VIEW_AREA_ID);

    updateViewSession(VIEW_AREA_ID, 'session_unknown', { splitRatio: 70 });

    expect(getViewSessionSet(VIEW_AREA_ID)).toEqual(setBefore);
  });
});
