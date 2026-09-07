import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ViewSessions } from '@minddrop/views';
import { splitTabWithTab } from './splitTabWithTab';

const VIEW_AREA_ID = 'test-set';

const view = {
  view: 'test:view',
  contentIcon: 'test-icon',
  title: 'Test view',
};

describe('splitTabWithTab', () => {
  beforeEach(() => {
    ViewSessions.Store.clear();
  });

  afterEach(() => {
    ViewSessions.Store.clear();
  });

  it('moves the source tab into the split pane and closes it', () => {
    ViewSessions.create(VIEW_AREA_ID);
    const first = ViewSessions.getActive(VIEW_AREA_ID)!.id;
    ViewSessions.create(VIEW_AREA_ID);
    const second = ViewSessions.getActive(VIEW_AREA_ID)!.id;
    ViewSessions.update(VIEW_AREA_ID, second, { main: view });

    splitTabWithTab(VIEW_AREA_ID, first, second);

    const sessions = ViewSessions.getAll(VIEW_AREA_ID);

    expect(sessions).toHaveLength(1);
    expect(sessions[0].id).toBe(first);
    expect(sessions[0].split).toEqual(view);
    expect(ViewSessions.getActive(VIEW_AREA_ID)?.id).toBe(first);
  });

  it('does nothing when the source tab has no view', () => {
    ViewSessions.create(VIEW_AREA_ID);
    const first = ViewSessions.getActive(VIEW_AREA_ID)!.id;
    ViewSessions.create(VIEW_AREA_ID);
    const second = ViewSessions.getActive(VIEW_AREA_ID)!.id;

    // Empty the source tab's main pane, as closing it does
    ViewSessions.update(VIEW_AREA_ID, second, { main: null });

    splitTabWithTab(VIEW_AREA_ID, first, second);

    const sessions = ViewSessions.getAll(VIEW_AREA_ID);

    expect(sessions).toHaveLength(2);
    expect(sessions[0].split).toBeNull();
  });

  it('does nothing when the tab does not exist', () => {
    ViewSessions.create(VIEW_AREA_ID);
    const first = ViewSessions.getActive(VIEW_AREA_ID)!.id;
    ViewSessions.update(VIEW_AREA_ID, first, { main: view });

    splitTabWithTab(VIEW_AREA_ID, 'missing', first);

    expect(ViewSessions.getAll(VIEW_AREA_ID)).toHaveLength(1);
  });
});
