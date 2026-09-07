import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SetViewAreaEventData } from '../../events';
import { ViewSessionsStore } from '../ViewSessionsStore';
import { createViewSession } from '../createViewSession';
import { getViewSessionSet } from '../getViewSessionSet';
import { recordViewArea } from '../recordViewArea';
import { closeViewSessionsForView } from './closeViewSessionsForView';

const VIEW_AREA_ID = 'test-set';

function state(
  main: SetViewAreaEventData['main'],
  split: SetViewAreaEventData['split'] = null,
  splitRatio = 50,
): SetViewAreaEventData {
  return { viewAreaId: VIEW_AREA_ID, main, split, splitRatio };
}

describe('closeViewSessionsForView', () => {
  beforeEach(() => {
    ViewSessionsStore.clear();
  });

  afterEach(() => {
    ViewSessionsStore.clear();
  });

  it('closes the session whose main view id matches', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));
    const closedId = getViewSessionSet(VIEW_AREA_ID).activeSessionId;
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));

    closeViewSessionsForView(VIEW_AREA_ID, 'db:a');

    const { sessions } = getViewSessionSet(VIEW_AREA_ID);

    expect(sessions).toHaveLength(1);
    expect(sessions.some((session) => session.id === closedId)).toBe(false);
  });

  it('clears the split when only the split view id matches', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(
      VIEW_AREA_ID,
      state(
        { view: 'db:view', id: 'db:main' },
        { view: 'db:view', id: 'db:split' },
        60,
      ),
    );

    closeViewSessionsForView(VIEW_AREA_ID, 'db:split');

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    expect(session.split).toBeNull();
    expect(session.main?.id).toBe('db:main');
  });

  it('prunes the closed view from surviving sessions history', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:c' }));

    closeViewSessionsForView(VIEW_AREA_ID, 'db:b');

    const { sessions } = getViewSessionSet(VIEW_AREA_ID);

    // The session survives because no visible pane shows the closed view
    expect(sessions).toHaveLength(1);
    expect(sessions[0].main?.id).toBe('db:c');
    // The first entry is the search view the session was opened on
    expect(sessions[0].backHistory).toHaveLength(2);
    expect(sessions[0].backHistory?.[1].main?.id).toBe('db:a');
  });
});
