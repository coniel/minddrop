import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SetViewAreaEventData } from '@minddrop/views';
import { TabSetsStore } from '../TabSetsStore';
import { getSet } from '../getSet';
import { newTab } from '../newTab';
import { recordViewArea } from '../recordViewArea';
import { setTransientViewState } from '../setTransientViewState';
import { updateTabsForView } from './updateTabsForView';

const VIEW_AREA_ID = 'test-set';

function state(
  main: SetViewAreaEventData['main'],
  split: SetViewAreaEventData['split'] = null,
  splitRatio = 50,
): SetViewAreaEventData {
  return { viewAreaId: VIEW_AREA_ID, main, split, splitRatio };
}

describe('updateTabsForView', () => {
  beforeEach(() => {
    TabSetsStore.clear();
  });

  afterEach(() => {
    TabSetsStore.clear();
  });

  it('updates the id, props, title and icon of the matching view', () => {
    newTab(VIEW_AREA_ID);
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

    updateTabsForView(VIEW_AREA_ID, 'db:a', {
      id: 'db:b',
      props: { databaseId: 'b' },
      title: 'B',
      icon: 'icon-b',
    });

    const main = getSet(VIEW_AREA_ID).tabs[0].main;

    expect(main?.id).toBe('db:b');
    expect(main?.props).toEqual({ databaseId: 'b' });
    expect(main?.title).toBe('B');
    expect(main?.icon).toBe('icon-b');
  });

  it('leaves non-matching views unchanged', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(
      VIEW_AREA_ID,
      state({ view: 'db:view', id: 'db:a', title: 'A' }),
    );

    updateTabsForView(VIEW_AREA_ID, 'db:other', { title: 'X' });

    expect(getSet(VIEW_AREA_ID).tabs[0].main?.title).toBe('A');
  });

  it('patches matching history entries', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(
      VIEW_AREA_ID,
      state({ view: 'db:view', id: 'db:a', title: 'A' }),
    );
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));

    updateTabsForView(VIEW_AREA_ID, 'db:a', { id: 'db:a2', title: 'A2' });

    // The first entry is the search view the tab was opened on
    const historyEntry = getSet(VIEW_AREA_ID).tabs[0].backHistory?.[1];

    expect(historyEntry?.main?.id).toBe('db:a2');
    expect(historyEntry?.main?.title).toBe('A2');
  });

  it('leaves the tab untouched when nothing matches', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:b' }));
    const tab = getSet(VIEW_AREA_ID).tabs[0];

    updateTabsForView(VIEW_AREA_ID, 'db:other', { title: 'X' });

    expect(getSet(VIEW_AREA_ID).tabs[0]).toBe(tab);
  });

  it('preserves the transient state of patched tabs', () => {
    newTab(VIEW_AREA_ID);
    recordViewArea(VIEW_AREA_ID, state({ view: 'db:view', id: 'db:a' }));

    const tab = getSet(VIEW_AREA_ID).tabs[0];

    setTransientViewState(VIEW_AREA_ID, tab.id, 'main', 'scroll', 120);

    updateTabsForView(VIEW_AREA_ID, 'db:a', { title: 'B' });

    expect(getSet(VIEW_AREA_ID).tabs[0].viewState?.main?.scroll).toBe(120);
  });
});
