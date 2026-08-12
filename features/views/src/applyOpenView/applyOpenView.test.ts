import { describe, expect, it } from 'vitest';
import { OpenViewEventData, ViewDescriptor } from '@minddrop/views';
import { ViewAreaState, applyOpenView } from './applyOpenView';

const mainView: ViewDescriptor = { view: 'test:view', id: 'main-view' };
const splitView: ViewDescriptor = { view: 'test:view', id: 'split-view' };

const splitState: ViewAreaState = {
  main: mainView,
  split: splitView,
  splitRatio: 60,
};

const unsplitState: ViewAreaState = {
  main: mainView,
  split: null,
  splitRatio: 50,
};

// An open of a view not currently shown in either pane
function open(data: Partial<OpenViewEventData> = {}): OpenViewEventData {
  return { view: 'test:view', id: 'opened-view', ...data };
}

describe('applyOpenView', () => {
  it('replaces the view area when the open has no source pane', () => {
    const state = applyOpenView(splitState, open());

    expect(state.main?.id).toBe('opened-view');
    expect(state.split).toBeNull();
  });

  it('replaces only the main pane when opened from it', () => {
    const state = applyOpenView(splitState, open({ sourcePane: 'main' }));

    expect(state.main?.id).toBe('opened-view');
    expect(state.split).toEqual(splitView);
    expect(state.splitRatio).toBe(60);
  });

  it('replaces only the split pane when opened from it', () => {
    const state = applyOpenView(splitState, open({ sourcePane: 'split' }));

    expect(state.main).toEqual(mainView);
    expect(state.split?.id).toBe('opened-view');
    expect(state.splitRatio).toBe(60);
  });

  it('opens into the split pane when splitting', () => {
    const state = applyOpenView(unsplitState, open({ split: true }));

    expect(state.main).toEqual(mainView);
    expect(state.split?.id).toBe('opened-view');
  });

  it('replaces the existing split pane when splitting again', () => {
    const state = applyOpenView(
      splitState,
      open({ split: true, sourcePane: 'main' }),
    );

    expect(state.main).toEqual(mainView);
    expect(state.split?.id).toBe('opened-view');
  });

  it('applies the requested split ratio', () => {
    const state = applyOpenView(
      unsplitState,
      open({ split: true, splitRatio: 30 }),
    );

    expect(state.splitRatio).toBe(30);
  });

  it('carries the view descriptor fields onto the opened pane', () => {
    const state = applyOpenView(
      unsplitState,
      open({ title: 'Title', icon: 'icon', props: { a: 1 } }),
    );

    expect(state.main).toEqual({
      view: 'test:view',
      id: 'opened-view',
      props: { a: 1 },
      title: 'Title',
      icon: 'icon',
      breadcrumbs: undefined,
    });
  });
});
