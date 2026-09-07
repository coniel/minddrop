import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ViewSessions } from '@minddrop/views';
import { activateLastTab } from './activateLastTab';

const VIEW_AREA_ID = 'test-set';

describe('activateLastTab', () => {
  beforeEach(() => {
    ViewSessions.Store.clear();
  });

  afterEach(() => {
    ViewSessions.Store.clear();
  });

  it('activates the last tab in the view area', () => {
    ViewSessions.create(VIEW_AREA_ID);
    const first = ViewSessions.getActive(VIEW_AREA_ID)!.id;
    ViewSessions.create(VIEW_AREA_ID);
    const last = ViewSessions.getActive(VIEW_AREA_ID)!.id;
    ViewSessions.setActive(VIEW_AREA_ID, first);

    activateLastTab(VIEW_AREA_ID);

    expect(ViewSessions.getActive(VIEW_AREA_ID)?.id).toBe(last);
  });

  it('does nothing when the view area has no tabs', () => {
    activateLastTab(VIEW_AREA_ID);

    expect(ViewSessions.getActive(VIEW_AREA_ID)).toBeNull();
  });
});
