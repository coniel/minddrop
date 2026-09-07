import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ViewSessionsStore } from '../ViewSessionsStore';
import { createViewSession } from '../createViewSession';
import { getViewSessionSet } from '../getViewSessionSet';
import { setViewSessionOrder } from './setViewSessionOrder';

const VIEW_AREA_ID = 'test-set';

describe('setViewSessionOrder', () => {
  beforeEach(() => {
    ViewSessionsStore.clear();
  });

  afterEach(() => {
    ViewSessionsStore.clear();
  });

  it('reorders the sessions to match the given ids', () => {
    createViewSession(VIEW_AREA_ID);
    const first = getViewSessionSet(VIEW_AREA_ID).sessions[0].id;
    createViewSession(VIEW_AREA_ID);
    const second = getViewSessionSet(VIEW_AREA_ID).sessions[1].id;

    setViewSessionOrder(VIEW_AREA_ID, [second, first]);

    const { sessions } = getViewSessionSet(VIEW_AREA_ID);

    expect(sessions[0].id).toBe(second);
    expect(sessions[1].id).toBe(first);
  });
});
