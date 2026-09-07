import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ViewSessionsStore } from '../ViewSessionsStore';
import { createViewSession } from '../createViewSession';
import { getViewSessionSet } from '../getViewSessionSet';
import { setActiveViewSession } from '../setActiveViewSession';
import { closeViewSession } from './closeViewSession';

const VIEW_AREA_ID = 'test-set';

describe('closeViewSession', () => {
  beforeEach(() => {
    ViewSessionsStore.clear();
  });

  afterEach(() => {
    ViewSessionsStore.clear();
  });

  it('removes the session and activates a neighbour', () => {
    createViewSession(VIEW_AREA_ID);
    const first = getViewSessionSet(VIEW_AREA_ID).activeSessionId;
    createViewSession(VIEW_AREA_ID);
    const second = getViewSessionSet(VIEW_AREA_ID).activeSessionId!;

    closeViewSession(VIEW_AREA_ID, second);

    const { sessions, activeSessionId } = getViewSessionSet(VIEW_AREA_ID);

    expect(sessions).toHaveLength(1);
    expect(sessions[0].id).toBe(first);
    expect(activeSessionId).toBe(first);
  });

  it('can close the last session, leaving none active', () => {
    createViewSession(VIEW_AREA_ID);

    closeViewSession(
      VIEW_AREA_ID,
      getViewSessionSet(VIEW_AREA_ID).activeSessionId!,
    );

    const { sessions, activeSessionId } = getViewSessionSet(VIEW_AREA_ID);

    expect(sessions).toHaveLength(0);
    expect(activeSessionId).toBeNull();
  });

  it('closes several sessions at once', () => {
    createViewSession(VIEW_AREA_ID);
    const first = getViewSessionSet(VIEW_AREA_ID).activeSessionId!;
    createViewSession(VIEW_AREA_ID);
    const second = getViewSessionSet(VIEW_AREA_ID).activeSessionId!;
    createViewSession(VIEW_AREA_ID);
    const third = getViewSessionSet(VIEW_AREA_ID).activeSessionId!;

    closeViewSession(VIEW_AREA_ID, [first, second]);

    const { sessions, activeSessionId } = getViewSessionSet(VIEW_AREA_ID);

    expect(sessions.map((session) => session.id)).toEqual([third]);
    expect(activeSessionId).toBe(third);
  });

  it('activates the session at the closed active one’s position', () => {
    createViewSession(VIEW_AREA_ID);
    const first = getViewSessionSet(VIEW_AREA_ID).activeSessionId!;
    createViewSession(VIEW_AREA_ID);
    const second = getViewSessionSet(VIEW_AREA_ID).activeSessionId!;
    createViewSession(VIEW_AREA_ID);
    const third = getViewSessionSet(VIEW_AREA_ID).activeSessionId!;
    setActiveViewSession(VIEW_AREA_ID, second);

    closeViewSession(VIEW_AREA_ID, [first, second]);

    expect(getViewSessionSet(VIEW_AREA_ID).activeSessionId).toBe(third);
  });

  it('does nothing when none of the sessions exist', () => {
    createViewSession(VIEW_AREA_ID);

    const setBefore = getViewSessionSet(VIEW_AREA_ID);

    closeViewSession(VIEW_AREA_ID, ['session_unknown']);

    expect(getViewSessionSet(VIEW_AREA_ID)).toEqual(setBefore);
  });
});
