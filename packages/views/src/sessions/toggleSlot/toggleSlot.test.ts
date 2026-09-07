import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ViewSessionsStore } from '../ViewSessionsStore';
import { createViewSession } from '../createViewSession';
import { getViewSessionSet } from '../getViewSessionSet';
import { setSlot } from '../setSlot';
import { toggleSlot } from './toggleSlot';

const VIEW_AREA_ID = 'test-set';

describe('toggleSlot', () => {
  beforeEach(() => {
    ViewSessionsStore.clear();
  });

  afterEach(() => {
    ViewSessionsStore.clear();
  });

  it('hides a shown slot, keeping its fill', () => {
    createViewSession(VIEW_AREA_ID);

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    setSlot(VIEW_AREA_ID, session.id, 'sidebar', { fill: 'test:fill' });
    toggleSlot(VIEW_AREA_ID, session.id, 'sidebar');

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0].slots).toEqual({
      sidebar: { fill: 'test:fill', hidden: true },
    });
  });

  it('shows a hidden slot', () => {
    createViewSession(VIEW_AREA_ID);

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    setSlot(VIEW_AREA_ID, session.id, 'sidebar', { hidden: true });
    toggleSlot(VIEW_AREA_ID, session.id, 'sidebar');

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0].slots).toEqual({
      sidebar: { hidden: false },
    });
  });

  it('hides a slot the session has no state for', () => {
    createViewSession(VIEW_AREA_ID);

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    toggleSlot(VIEW_AREA_ID, session.id, 'sidebar');

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0].slots).toEqual({
      sidebar: { hidden: true },
    });
  });

  it('does nothing for an unknown session id', () => {
    createViewSession(VIEW_AREA_ID);

    const setBefore = getViewSessionSet(VIEW_AREA_ID);

    toggleSlot(VIEW_AREA_ID, 'session_unknown', 'sidebar');

    expect(getViewSessionSet(VIEW_AREA_ID)).toEqual(setBefore);
  });
});
