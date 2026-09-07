import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ViewSessions } from '@minddrop/views';
import { closeTabsToTheLeft } from './closeTabsToTheLeft';

const VIEW_AREA_ID = 'test-set';

describe('closeTabsToTheLeft', () => {
  beforeEach(() => {
    ViewSessions.Store.clear();
  });

  afterEach(() => {
    ViewSessions.Store.clear();
  });

  it('closes the tabs positioned before the given tab', () => {
    ViewSessions.create(VIEW_AREA_ID);
    ViewSessions.create(VIEW_AREA_ID);
    const second = ViewSessions.getActive(VIEW_AREA_ID)!.id;
    ViewSessions.create(VIEW_AREA_ID);
    const third = ViewSessions.getActive(VIEW_AREA_ID)!.id;

    closeTabsToTheLeft(VIEW_AREA_ID, second);

    const sessions = ViewSessions.getAll(VIEW_AREA_ID);

    expect(sessions.map((session) => session.id)).toEqual([second, third]);
    expect(ViewSessions.getActive(VIEW_AREA_ID)?.id).toBe(third);
  });

  it('activates the given tab when the active tab was closed', () => {
    ViewSessions.create(VIEW_AREA_ID);
    const first = ViewSessions.getActive(VIEW_AREA_ID)!.id;
    ViewSessions.create(VIEW_AREA_ID);
    const second = ViewSessions.getActive(VIEW_AREA_ID)!.id;

    ViewSessions.setActive(VIEW_AREA_ID, first);
    closeTabsToTheLeft(VIEW_AREA_ID, second);

    expect(ViewSessions.getAll(VIEW_AREA_ID)).toHaveLength(1);
    expect(ViewSessions.getActive(VIEW_AREA_ID)?.id).toBe(second);
  });

  it('does nothing when the tab does not exist', () => {
    ViewSessions.create(VIEW_AREA_ID);
    ViewSessions.create(VIEW_AREA_ID);

    closeTabsToTheLeft(VIEW_AREA_ID, 'missing');

    expect(ViewSessions.getAll(VIEW_AREA_ID)).toHaveLength(2);
  });
});
