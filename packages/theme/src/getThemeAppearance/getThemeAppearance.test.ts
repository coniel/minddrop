import { setup, cleanup } from '../test-utils';
import { useThemeStore } from '../useThemeStore';
import { getThemeAppearance } from './getThemeAppearance';

describe('getThemeAppearance', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the current theme appearance', () => {
    // Set the current appearance to 'dark'
    useThemeStore.getState().setAppearance('dark');

    // Get the current appearance
    const appearance = getThemeAppearance();

    // Should return the current appearance
    expect(appearance).toBe('dark');
  });
});
