import { setup, cleanup } from '../test-utils';
import { useThemeStore } from '../useThemeStore';
import { getThemeAppearanceSetting } from './getThemeAppearanceSetting';

describe('getThemeAppearanceSetting', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the theme appearance setting', () => {
    // Set the current appearance setting to 'dark'
    useThemeStore.getState().setAppearanceSetting('dark');

    // Get the appearance setting
    const appearance = getThemeAppearanceSetting();

    // Should return the appearance setting
    expect(appearance).toBe('dark');
  });
});
