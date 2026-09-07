import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ViewSessionsStore } from '../ViewSessionsStore';
import { createViewSession } from '../createViewSession';
import { getViewSessionSet } from '../getViewSessionSet';
import { setSlot } from './setSlot';

const VIEW_AREA_ID = 'test-set';

describe('setSlot', () => {
  beforeEach(() => {
    ViewSessionsStore.clear();
  });

  afterEach(() => {
    ViewSessionsStore.clear();
  });

  it('stores the state on the session under the slot id', () => {
    createViewSession(VIEW_AREA_ID);

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    setSlot(VIEW_AREA_ID, session.id, 'sidebar', {
      fill: 'test:fill',
      props: { entryId: 'a' },
    });

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0].slots).toEqual({
      sidebar: { fill: 'test:fill', props: { entryId: 'a' } },
    });
  });

  it('merges the state onto the slot, keeping what it does not name', () => {
    createViewSession(VIEW_AREA_ID);

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    setSlot(VIEW_AREA_ID, session.id, 'sidebar', {
      fill: 'test:fill',
      props: { entryId: 'a' },
    });
    setSlot(VIEW_AREA_ID, session.id, 'sidebar', { hidden: true });

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0].slots).toEqual({
      sidebar: { fill: 'test:fill', props: { entryId: 'a' }, hidden: true },
    });
  });

  it('keeps the state of other slots', () => {
    createViewSession(VIEW_AREA_ID);

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    setSlot(VIEW_AREA_ID, session.id, 'sidebar', { fill: 'test:fill' });
    setSlot(VIEW_AREA_ID, session.id, 'right-panel', { fill: 'test:panel' });

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0].slots).toEqual({
      sidebar: { fill: 'test:fill' },
      'right-panel': { fill: 'test:panel' },
    });
  });

  it('leaves the session untouched when the slot already holds the state', () => {
    createViewSession(VIEW_AREA_ID);

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    setSlot(VIEW_AREA_ID, session.id, 'sidebar', {
      fill: 'test:fill',
      props: { entryId: 'a' },
    });

    const filled = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    setSlot(VIEW_AREA_ID, session.id, 'sidebar', {
      fill: 'test:fill',
      props: { entryId: 'a' },
    });

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0]).toBe(filled);
  });

  it('leaves other sessions untouched', () => {
    createViewSession(VIEW_AREA_ID);
    createViewSession(VIEW_AREA_ID);

    const [firstSession, secondSession] =
      getViewSessionSet(VIEW_AREA_ID).sessions;

    setSlot(VIEW_AREA_ID, secondSession.id, 'sidebar', { fill: 'test:fill' });

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0]).toEqual(firstSession);
  });

  it('does nothing for an unknown session id', () => {
    createViewSession(VIEW_AREA_ID);

    const setBefore = getViewSessionSet(VIEW_AREA_ID);

    setSlot(VIEW_AREA_ID, 'session_unknown', 'sidebar', {
      fill: 'test:fill',
    });

    expect(getViewSessionSet(VIEW_AREA_ID)).toEqual(setBefore);
  });
});
