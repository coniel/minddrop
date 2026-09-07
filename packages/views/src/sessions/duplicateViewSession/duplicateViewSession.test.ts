import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ViewSessionsStore } from '../ViewSessionsStore';
import { createViewSession } from '../createViewSession';
import { getViewSessionSet } from '../getViewSessionSet';
import { updateViewSession } from '../updateViewSession';
import { duplicateViewSession } from './duplicateViewSession';

const VIEW_AREA_ID = 'test-set';

const view = {
  view: 'test:view',
  contentIcon: 'test-icon',
  title: 'Test view',
};

describe('duplicateViewSession', () => {
  beforeEach(() => {
    ViewSessionsStore.clear();
  });

  afterEach(() => {
    ViewSessionsStore.clear();
  });

  it('inserts a copy after the session and makes it active', () => {
    createViewSession(VIEW_AREA_ID);
    const first = getViewSessionSet(VIEW_AREA_ID).activeSessionId!;
    updateViewSession(VIEW_AREA_ID, first, { main: view });
    createViewSession(VIEW_AREA_ID);
    const second = getViewSessionSet(VIEW_AREA_ID).activeSessionId!;

    duplicateViewSession(VIEW_AREA_ID, first);

    const { sessions, activeSessionId } = getViewSessionSet(VIEW_AREA_ID);

    expect(sessions).toHaveLength(3);
    expect(sessions[0].id).toBe(first);
    expect(sessions[2].id).toBe(second);
    expect(sessions[1].id).not.toBe(first);
    expect(sessions[1].main).toEqual(view);
    expect(activeSessionId).toBe(sessions[1].id);
  });

  it('does nothing when the session does not exist', () => {
    createViewSession(VIEW_AREA_ID);

    duplicateViewSession(VIEW_AREA_ID, 'missing');

    expect(getViewSessionSet(VIEW_AREA_ID).sessions).toHaveLength(1);
  });
});
