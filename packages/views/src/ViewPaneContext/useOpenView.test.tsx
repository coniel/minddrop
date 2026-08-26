import { afterEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { renderHook } from '@minddrop/test-utils';
import { BaseOpenViewEventData } from '../types';
import { ViewPaneProvider } from './ViewPaneContext';
import { useOpenView } from './useOpenView';

const TestOpenEvent = 'test:view:open';
const ListenerId = 'use-open-view-test';

// Register the test event so the captured data is typed
declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'test:view:open': BaseOpenViewEventData;
  }
}

// Renders the hook inside a pane
function renderInPane() {
  return renderHook(() => useOpenView(), {
    wrapper: ({ children }) => (
      <ViewPaneProvider viewAreaId="main" pane="split">
        {children}
      </ViewPaneProvider>
    ),
  });
}

// Captures the data of the next dispatched open event
function captureDispatch(): { data?: BaseOpenViewEventData } {
  const captured: { data?: BaseOpenViewEventData } = {};

  Events.addListener(TestOpenEvent, ListenerId, ({ data }) => {
    captured.data = data;
  });

  return captured;
}

describe('useOpenView', () => {
  afterEach(() => {
    Events.removeListener(TestOpenEvent, ListenerId);
  });

  it('tags the event with the surrounding pane', () => {
    const captured = captureDispatch();
    const { result } = renderInPane();

    result.current(TestOpenEvent, { entryId: 'entry-1' });

    expect(captured.data).toEqual({
      entryId: 'entry-1',
      viewAreaId: 'main',
      sourcePane: 'split',
    });
  });

  it('leaves the event untagged outside of a pane', () => {
    const captured = captureDispatch();
    const { result } = renderHook(() => useOpenView());

    result.current(TestOpenEvent, { entryId: 'entry-1' });

    expect(captured.data).toEqual({
      entryId: 'entry-1',
      viewAreaId: undefined,
      sourcePane: undefined,
    });
  });

  it('keeps the pane set by the caller', () => {
    const captured = captureDispatch();
    const { result } = renderInPane();

    result.current(TestOpenEvent, {
      entryId: 'entry-1',
      viewAreaId: 'other',
      sourcePane: 'main',
    });

    expect(captured.data?.viewAreaId).toBe('other');
    expect(captured.data?.sourcePane).toBe('main');
  });

  it('passes the event data through', () => {
    const captured = captureDispatch();
    const { result } = renderInPane();

    result.current(TestOpenEvent, {
      entryId: 'entry-1',
      openMode: 'in-place',
    });

    expect(captured.data?.openMode).toBe('in-place');
  });
});
