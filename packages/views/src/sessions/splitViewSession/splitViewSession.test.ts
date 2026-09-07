import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ViewSessionsStore } from '../ViewSessionsStore';
import { createViewSession } from '../createViewSession';
import { getViewSessionSet } from '../getViewSessionSet';
import { setActiveViewSession } from '../setActiveViewSession';
import { splitViewSession } from './splitViewSession';

const VIEW_AREA_ID = 'test-set';

const view = {
  view: 'test:view',
  contentIcon: 'test-icon',
};

describe('splitViewSession', () => {
  beforeEach(() => {
    ViewSessionsStore.clear();
  });

  afterEach(() => {
    ViewSessionsStore.clear();
  });

  it('opens the view in the split pane and activates the session', () => {
    createViewSession(VIEW_AREA_ID);
    const first = getViewSessionSet(VIEW_AREA_ID).activeSessionId!;
    createViewSession(VIEW_AREA_ID);
    const second = getViewSessionSet(VIEW_AREA_ID).activeSessionId!;

    setActiveViewSession(VIEW_AREA_ID, second);
    splitViewSession(VIEW_AREA_ID, first, view);

    const { sessions, activeSessionId } = getViewSessionSet(VIEW_AREA_ID);

    expect(sessions[0].split).toEqual(view);
    expect(sessions[1].split).toBeNull();
    expect(activeSessionId).toBe(first);
  });

  it('does nothing when the session does not exist', () => {
    createViewSession(VIEW_AREA_ID);

    splitViewSession(VIEW_AREA_ID, 'missing', view);

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0].split).toBeNull();
  });
});
