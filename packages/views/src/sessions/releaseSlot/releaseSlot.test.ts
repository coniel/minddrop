import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ViewSessionsStore } from '../ViewSessionsStore';
import { claimSlot } from '../claimSlot';
import { createViewSession } from '../createViewSession';
import { getViewSessionSet } from '../getViewSessionSet';
import { releaseSlot } from './releaseSlot';

const VIEW_AREA_ID = 'test-set';

describe('releaseSlot', () => {
  beforeEach(() => {
    ViewSessionsStore.clear();
  });

  afterEach(() => {
    ViewSessionsStore.clear();
  });

  it('removes the claim from the session', () => {
    createViewSession(VIEW_AREA_ID);

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    claimSlot(VIEW_AREA_ID, session.id, 'sidebar', { fill: 'test:fill' });
    claimSlot(VIEW_AREA_ID, session.id, 'right-panel', { fill: 'test:panel' });

    releaseSlot(VIEW_AREA_ID, session.id, 'sidebar');

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0].slots).toEqual({
      'right-panel': { fill: 'test:panel' },
    });
  });

  it('leaves the session untouched when it holds no claim on the slot', () => {
    createViewSession(VIEW_AREA_ID);

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    releaseSlot(VIEW_AREA_ID, session.id, 'sidebar');

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0]).toBe(session);
  });

  it('does nothing for an unknown session id', () => {
    createViewSession(VIEW_AREA_ID);

    const setBefore = getViewSessionSet(VIEW_AREA_ID);

    releaseSlot(VIEW_AREA_ID, 'session_unknown', 'sidebar');

    expect(getViewSessionSet(VIEW_AREA_ID)).toEqual(setBefore);
  });
});
