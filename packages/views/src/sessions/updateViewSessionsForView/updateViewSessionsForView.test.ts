import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SetViewAreaEventData } from '../../events';
import { ViewSessionsStore } from '../ViewSessionsStore';
import { createViewSession } from '../createViewSession';
import { getViewSessionSet } from '../getViewSessionSet';
import { recordViewArea } from '../recordViewArea';
import { setTransientViewState } from '../setTransientViewState';
import { updateViewSessionsForView } from './updateViewSessionsForView';

const VIEW_AREA_ID = 'test-set';

function state(
  main: SetViewAreaEventData['main'],
  split: SetViewAreaEventData['split'] = null,
  splitRatio = 50,
): SetViewAreaEventData {
  return { viewAreaId: VIEW_AREA_ID, main, split, splitRatio };
}

describe('updateViewSessionsForView', () => {
  beforeEach(() => {
    ViewSessionsStore.clear();
  });

  afterEach(() => {
    ViewSessionsStore.clear();
  });

  it('updates the id, props, title and icon of the matching view', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(
      VIEW_AREA_ID,
      state({
        view: 'db:view',
        id: 'db:a',
        props: { databaseId: 'a' },
        title: 'A',
        icon: 'icon-a',
      }),
    );

    updateViewSessionsForView(VIEW_AREA_ID, 'db:a', {
      id: 'db:b',
      props: { databaseId: 'b' },
      title: 'B',
      icon: 'icon-b',
    });

    const main = getViewSessionSet(VIEW_AREA_ID).sessions[0].main;

    expect(main?.id).toBe('db:b');
    expect(main?.props).toEqual({ databaseId: 'b' });
    expect(main?.title).toBe('B');
    expect(main?.contentIcon).toBe('icon-b');
  });

  it('leaves non-matching views unchanged', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(
      VIEW_AREA_ID,
      state({ view: 'db:view', id: 'db:a', title: 'A' }),
    );

    updateViewSessionsForView(VIEW_AREA_ID, 'db:other', { title: 'X' });

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0].main?.title).toBe('A');
  });

  it('patches matching history entries', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(
      VIEW_AREA_ID,
      state({ view: 'db:view', id: 'db:a', title: 'A' }),
    );
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));

    updateViewSessionsForView(VIEW_AREA_ID, 'db:a', {
      id: 'db:a2',
      title: 'A2',
    });

    // The first entry is the search view the session was opened on
    const historyEntry =
      getViewSessionSet(VIEW_AREA_ID).sessions[0].backHistory?.[1];

    expect(historyEntry?.main?.id).toBe('db:a2');
    expect(historyEntry?.main?.title).toBe('A2');
  });

  it('leaves the session untouched when nothing matches', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));
    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    updateViewSessionsForView(VIEW_AREA_ID, 'db:other', { title: 'X' });

    expect(getViewSessionSet(VIEW_AREA_ID).sessions[0]).toBe(session);
  });

  it('preserves the transient state of patched sessions', () => {
    createViewSession(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));

    const session = getViewSessionSet(VIEW_AREA_ID).sessions[0];

    setTransientViewState(VIEW_AREA_ID, session.id, 'main', 'scroll', 120);

    updateViewSessionsForView(VIEW_AREA_ID, 'db:a', { title: 'B' });

    expect(
      getViewSessionSet(VIEW_AREA_ID).sessions[0].viewState?.main?.scroll,
    ).toBe(120);
  });
});
