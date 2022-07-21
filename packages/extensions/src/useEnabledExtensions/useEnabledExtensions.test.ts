import { renderHook, act } from '@minddrop/test-utils';
import { setup, cleanup, enabledExtensions } from '../test-utils';
import { useEnabledExtensions } from './useEnabledExtensions';

describe('useEnabledExtensions', () => {
  beforeEach(setup);

  afterEach(() => {
    act(() => {
      cleanup();
    });
  });

  it('returns all enabled extensions', () => {
    // Get all enabled extensions
    const { result } = renderHook(() => useEnabledExtensions());

    // Should return all enabled extensions
    expect(result.current.length).toEqual(enabledExtensions.length);
    result.current.forEach((extension) => {
      expect(extension).toEqual(
        enabledExtensions.find(({ id }) => id === extension.id),
      );
    });
  });
});
