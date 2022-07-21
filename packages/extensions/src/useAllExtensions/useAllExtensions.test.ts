import { renderHook, act } from '@minddrop/test-utils';
import { setup, cleanup, extensions } from '../test-utils';
import { useAllExtensions } from './useAllExtensions';

describe('useAllExtensions', () => {
  beforeEach(setup);

  afterEach(() => {
    act(() => {
      cleanup();
    });
  });

  it('returns all registered extensions', () => {
    // Get all extensions
    const { result } = renderHook(() => useAllExtensions());

    // Should return all registered extensions
    expect(result.current.length).toEqual(extensions.length);
    result.current.forEach((extension) => {
      expect(extension).toEqual(
        extensions.find(({ id }) => id === extension.id),
      );
    });
  });
});
