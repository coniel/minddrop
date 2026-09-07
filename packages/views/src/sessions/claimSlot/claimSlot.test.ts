import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ViewSessionsStore } from '../ViewSessionsStore';
import { createViewSession } from '../createViewSession';
import { getViewSessionSet } from '../getViewSessionSet';
import { claimSlot } from './claimSlot';

const VIEW_AREA_ID = 'test-set';

describe('claimSlot', () => {
  beforeEach(() => {
    ViewSessionsStore.clear();
  });

  afterEach(() => {
    ViewSessionsStore.clear();
  });

  it('stores the claim on the session under the slot id', () => {
    createViewSession(VIEW_AREA_ID);

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    claimSlot(VIEW_AREA_ID, session.id, 'sidebar', {
      fill: 'test:fill',
      props: { entryId: 'a' },
    });

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0].slots).toEqual({
      sidebar: { fill: 'test:fill', props: { entryId: 'a' } },
    });
  });

  it('keeps claims on other slots', () => {
    createViewSession(VIEW_AREA_ID);

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    claimSlot(VIEW_AREA_ID, session.id, 'sidebar', { fill: 'test:fill' });
    claimSlot(VIEW_AREA_ID, session.id, 'right-panel', { fill: 'test:panel' });

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0].slots).toEqual({
      sidebar: { fill: 'test:fill' },
      'right-panel': { fill: 'test:panel' },
    });
  });

  it('leaves the session untouched when it already holds an equal claim', () => {
    createViewSession(VIEW_AREA_ID);

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    claimSlot(VIEW_AREA_ID, session.id, 'sidebar', {
      fill: 'test:fill',
      props: { entryId: 'a' },
    });

    const claimed = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    claimSlot(VIEW_AREA_ID, session.id, 'sidebar', {
      fill: 'test:fill',
      props: { entryId: 'a' },
    });

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0]).toBe(claimed);
  });

  it('leaves other sessions untouched', () => {
    createViewSession(VIEW_AREA_ID);
    createViewSession(VIEW_AREA_ID);

    const [firstSession, secondSession] =
      getViewSessionSet(VIEW_AREA_ID).sessions;

    claimSlot(VIEW_AREA_ID, secondSession.id, 'sidebar', { fill: 'test:fill' });

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0]).toEqual(firstSession);
  });

  it('does nothing for an unknown session id', () => {
    createViewSession(VIEW_AREA_ID);

    const setBefore = getViewSessionSet(VIEW_AREA_ID);

    claimSlot(VIEW_AREA_ID, 'session_unknown', 'sidebar', {
      fill: 'test:fill',
    });

    expect(getViewSessionSet(VIEW_AREA_ID)).toEqual(setBefore);
  });
});
