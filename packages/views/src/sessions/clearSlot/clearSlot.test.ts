import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ViewSessionsStore } from '../ViewSessionsStore';
import { createViewSession } from '../createViewSession';
import { getViewSessionSet } from '../getViewSessionSet';
import { setSlot } from '../setSlot';
import { clearSlot } from './clearSlot';

const VIEW_AREA_ID = 'test-set';

describe('clearSlot', () => {
  beforeEach(() => {
    ViewSessionsStore.clear();
  });

  afterEach(() => {
    ViewSessionsStore.clear();
  });

  it('removes the slot state from the session', () => {
    createViewSession(VIEW_AREA_ID);

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    setSlot(VIEW_AREA_ID, session.id, 'sidebar', { fill: 'test:fill' });
    setSlot(VIEW_AREA_ID, session.id, 'right-panel', { fill: 'test:panel' });

    clearSlot(VIEW_AREA_ID, session.id, 'sidebar');

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0].slots).toEqual({
      'right-panel': { fill: 'test:panel' },
    });
  });

  it('leaves the session untouched when it has no state for the slot', () => {
    createViewSession(VIEW_AREA_ID);

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    clearSlot(VIEW_AREA_ID, session.id, 'sidebar');

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0]).toBe(session);
  });

  it('does nothing for an unknown session id', () => {
    createViewSession(VIEW_AREA_ID);

    const setBefore = getViewSessionSet(VIEW_AREA_ID);

    clearSlot(VIEW_AREA_ID, 'session_unknown', 'sidebar');

    expect(getViewSessionSet(VIEW_AREA_ID)).toEqual(setBefore);
  });
});
