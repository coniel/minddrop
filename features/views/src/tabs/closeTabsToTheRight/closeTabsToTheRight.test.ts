import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ViewSessions } from '@minddrop/views';
import { closeTabsToTheRight } from './closeTabsToTheRight';

const VIEW_AREA_ID = 'test-set';

describe('closeTabsToTheRight', () => {
  beforeEach(() => {
    ViewSessions.Store.clear();
  });

  afterEach(() => {
    ViewSessions.Store.clear();
  });

  it('closes the tabs positioned after the given tab', () => {
    ViewSessions.create(VIEW_AREA_ID);
    const first = ViewSessions.getActive(VIEW_AREA_ID)!.id;
    ViewSessions.create(VIEW_AREA_ID);
    const second = ViewSessions.getActive(VIEW_AREA_ID)!.id;
    ViewSessions.create(VIEW_AREA_ID);
    ViewSessions.setActive(VIEW_AREA_ID, first);

    closeTabsToTheRight(VIEW_AREA_ID, second);

    const sessions = ViewSessions.getAll(VIEW_AREA_ID);

    expect(sessions.map((session) => session.id)).toEqual([first, second]);
    expect(ViewSessions.getActive(VIEW_AREA_ID)?.id).toBe(first);
  });

  it('activates the given tab when the active tab was closed', () => {
    ViewSessions.create(VIEW_AREA_ID);
    const first = ViewSessions.getActive(VIEW_AREA_ID)!.id;
    ViewSessions.create(VIEW_AREA_ID);

    closeTabsToTheRight(VIEW_AREA_ID, first);

    expect(ViewSessions.getAll(VIEW_AREA_ID)).toHaveLength(1);
    expect(ViewSessions.getActive(VIEW_AREA_ID)?.id).toBe(first);
  });

  it('does nothing when the tab does not exist', () => {
    ViewSessions.create(VIEW_AREA_ID);
    ViewSessions.create(VIEW_AREA_ID);

    closeTabsToTheRight(VIEW_AREA_ID, 'missing');

    expect(ViewSessions.getAll(VIEW_AREA_ID)).toHaveLength(2);
  });
});
