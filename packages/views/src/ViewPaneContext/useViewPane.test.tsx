import { describe, expect, it } from 'vitest';
import { renderHook } from '@minddrop/test-utils';
import { ViewPaneProvider } from './ViewPaneContext';
import { useViewPane } from './useViewPane';

describe('useViewPane', () => {
  it('returns the location from the surrounding provider', () => {
    const { result } = renderHook(() => useViewPane(), {
      wrapper: ({ children }) => (
        <ViewPaneProvider viewAreaId="main" pane="split">
          {children}
        </ViewPaneProvider>
      ),
    });

    expect(result.current).toEqual({ viewAreaId: 'main', pane: 'split' });
  });

  it('returns null outside of a provider', () => {
    const { result } = renderHook(() => useViewPane());

    expect(result.current).toBeNull();
  });
});
