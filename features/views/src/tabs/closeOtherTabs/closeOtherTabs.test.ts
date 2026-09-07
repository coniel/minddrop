import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ViewSessions } from '@minddrop/views';
import { closeOtherTabs } from './closeOtherTabs';

const VIEW_AREA_ID = 'test-set';

describe('closeOtherTabs', () => {
  beforeEach(() => {
    ViewSessions.Store.clear();
  });

  afterEach(() => {
    ViewSessions.Store.clear();
  });

  it('keeps only the given tab and activates it', () => {
    ViewSessions.create(VIEW_AREA_ID);
    const first = ViewSessions.getActive(VIEW_AREA_ID)!.id;
    ViewSessions.create(VIEW_AREA_ID);
    ViewSessions.create(VIEW_AREA_ID);

    closeOtherTabs(VIEW_AREA_ID, first);

    const sessions = ViewSessions.getAll(VIEW_AREA_ID);

    expect(sessions).toHaveLength(1);
    expect(sessions[0].id).toBe(first);
    expect(ViewSessions.getActive(VIEW_AREA_ID)?.id).toBe(first);
  });

  it('does nothing when the tab does not exist', () => {
    ViewSessions.create(VIEW_AREA_ID);
    ViewSessions.create(VIEW_AREA_ID);

    closeOtherTabs(VIEW_AREA_ID, 'missing');

    expect(ViewSessions.getAll(VIEW_AREA_ID)).toHaveLength(2);
  });
});
