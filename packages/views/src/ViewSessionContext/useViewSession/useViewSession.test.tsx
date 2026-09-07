import { describe, expect, it } from 'vitest';
import { renderHook } from '@minddrop/test-utils';
import { ViewSessionProvider } from '../ViewSessionContext';
import { useViewSession } from './useViewSession';

describe('useViewSession', () => {
  it('returns the session id from the surrounding provider', () => {
    const { result } = renderHook(() => useViewSession(), {
      wrapper: ({ children }) => (
        <ViewSessionProvider sessionId="session_1">
          {children}
        </ViewSessionProvider>
      ),
    });

    expect(result.current).toBe('session_1');
  });

  it('returns null outside of a provider', () => {
    const { result } = renderHook(() => useViewSession());

    expect(result.current).toBeNull();
  });
});
