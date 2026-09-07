import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ViewSessionsStore } from '../ViewSessionsStore';
import { createViewSession } from '../createViewSession';
import { getViewSessionSet } from '../getViewSessionSet';
import { setSlot } from '../setSlot';
import { initializeSlot } from './initializeSlot';

const VIEW_AREA_ID = 'test-set';

describe('initializeSlot', () => {
  beforeEach(() => {
    ViewSessionsStore.clear();
  });

  afterEach(() => {
    ViewSessionsStore.clear();
  });

  it('sets the state when the session has none for the slot', () => {
    createViewSession(VIEW_AREA_ID);

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    initializeSlot(VIEW_AREA_ID, session.id, 'sidebar', {
      fill: 'test:fill',
      hidden: true,
    });

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0].slots).toEqual({
      sidebar: { fill: 'test:fill', hidden: true },
    });
  });

  it('leaves the session untouched when the slot already has state', () => {
    createViewSession(VIEW_AREA_ID);

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    setSlot(VIEW_AREA_ID, session.id, 'sidebar', { hidden: true });

    const filled = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    initializeSlot(VIEW_AREA_ID, session.id, 'sidebar', { fill: 'test:fill' });

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0]).toBe(filled);
  });

  it('does nothing for an unknown session id', () => {
    createViewSession(VIEW_AREA_ID);

    const setBefore = getViewSessionSet(VIEW_AREA_ID);

    initializeSlot(VIEW_AREA_ID, 'session_unknown', 'sidebar', {
      fill: 'test:fill',
    });

    expect(getViewSessionSet(VIEW_AREA_ID)).toEqual(setBefore);
  });
});
