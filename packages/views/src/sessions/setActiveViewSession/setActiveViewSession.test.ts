import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ViewSessionsStore } from '../ViewSessionsStore';
import { createViewSession } from '../createViewSession';
import { getViewSessionSet } from '../getViewSessionSet';
import { setActiveViewSession } from './setActiveViewSession';

const VIEW_AREA_ID = 'test-set';

describe('setActiveViewSession', () => {
  beforeEach(() => {
    ViewSessionsStore.clear();
  });

  afterEach(() => {
    ViewSessionsStore.clear();
  });

  it('activates the given session', () => {
    createViewSession(VIEW_AREA_ID);
    const first = getViewSessionSet(VIEW_AREA_ID).activeSessionId!;
    createViewSession(VIEW_AREA_ID);

    setActiveViewSession(VIEW_AREA_ID, first);

    expect(getViewSessionSet(VIEW_AREA_ID).activeSessionId).toBe(first);
  });
});
