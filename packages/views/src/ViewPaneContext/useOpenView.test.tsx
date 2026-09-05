import { afterEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { renderHook } from '@minddrop/test-utils';
import { BaseOpenViewEventData } from '../types';
import { ViewPaneProvider } from './ViewPaneContext';
import { useOpenView } from './useOpenView';

const TestOpenEvent = 'test:view:open';
const ListenerId = 'use-open-view-test';

// Data of the test open event, carrying a field of its own
// alongside the pane fields
interface TestOpenEventData extends BaseOpenViewEventData {
  entryId: string;
}

// Register the test event so the captured data is typed
declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'test:view:open': TestOpenEventData;
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

  Events.addListener(TestOpenEvent, ListenerId, (data) => {
    captured.data = data;
  });

  return captured;
}

describe('useOpenView', () => {
  afterEach(() => {
    Events.removeListener(TestOpenEvent, ListenerId);
  });

  it('tags the event with the surrounding pane', async () => {
    const captured = captureDispatch();
    const { result } = renderInPane();

    result.current(TestOpenEvent, { entryId: 'entry-1' });

    // The capture listener runs queued rather than during the
    // dispatch.
    await vi.waitFor(() => {
      expect(captured.data).toEqual({
        entryId: 'entry-1',
        viewAreaId: 'main',
        sourcePane: 'split',
      });
    });
  });

  it('leaves the event untagged outside of a pane', async () => {
    const captured = captureDispatch();
    const { result } = renderHook(() => useOpenView());

    result.current(TestOpenEvent, { entryId: 'entry-1' });

    // The capture listener runs queued rather than during the
    // dispatch.
    await vi.waitFor(() => {
      expect(captured.data).toEqual({
        entryId: 'entry-1',
        viewAreaId: undefined,
        sourcePane: undefined,
      });
    });
  });

  it('keeps the pane set by the caller', async () => {
    const captured = captureDispatch();
    const { result } = renderInPane();

    result.current(TestOpenEvent, {
      entryId: 'entry-1',
      viewAreaId: 'other',
      sourcePane: 'main',
    });

    // The capture listener runs queued rather than during the
    // dispatch.
    await vi.waitFor(() => {
      expect(captured.data?.viewAreaId).toBe('other');
      expect(captured.data?.sourcePane).toBe('main');
    });
  });

  it('passes the event data through', async () => {
    const captured = captureDispatch();
    const { result } = renderInPane();

    result.current(TestOpenEvent, {
      entryId: 'entry-1',
      openMode: 'in-place',
    });

    // The capture listener runs queued rather than during the
    // dispatch.
    await vi.waitFor(() => {
      expect(captured.data?.openMode).toBe('in-place');
    });
  });
});
