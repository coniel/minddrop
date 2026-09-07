import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ViewSessionsStore } from '../ViewSessionsStore';
import { createViewSession } from '../createViewSession';
import { getViewSessionSet } from '../getViewSessionSet';
import { splitViewSession } from '../splitViewSession';
import { unsplitViewSession } from './unsplitViewSession';

const VIEW_AREA_ID = 'test-set';

const view = {
  view: 'test:view',
  contentIcon: 'test-icon',
};

describe('unsplitViewSession', () => {
  beforeEach(() => {
    ViewSessionsStore.clear();
  });

  afterEach(() => {
    ViewSessionsStore.clear();
  });

  it('moves the split pane into a session after the unsplit one', () => {
    createViewSession(VIEW_AREA_ID);
    const first = getViewSessionSet(VIEW_AREA_ID).activeSessionId!;
    createViewSession(VIEW_AREA_ID);
    const second = getViewSessionSet(VIEW_AREA_ID).activeSessionId!;
    splitViewSession(VIEW_AREA_ID, first, view);

    unsplitViewSession(VIEW_AREA_ID, first);

    const { sessions, activeSessionId } = getViewSessionSet(VIEW_AREA_ID);

    expect(sessions).toHaveLength(3);
    expect(sessions[0].id).toBe(first);
    expect(sessions[0].split).toBeNull();
    expect(sessions[1].main).toEqual(view);
    expect(sessions[2].id).toBe(second);
    expect(activeSessionId).toBe(first);
  });

  it('does nothing when the session does not exist', () => {
    createViewSession(VIEW_AREA_ID);
    const sessionId = getViewSessionSet(VIEW_AREA_ID).activeSessionId!;
    splitViewSession(VIEW_AREA_ID, sessionId, view);

    unsplitViewSession(VIEW_AREA_ID, 'missing');

    const { sessions } = getViewSessionSet(VIEW_AREA_ID);

    expect(sessions).toHaveLength(1);
    expect(sessions[0].split).toEqual(view);
  });
});
