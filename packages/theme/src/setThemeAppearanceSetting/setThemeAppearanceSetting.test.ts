import { InvalidParameterError } from '@minddrop/utils';
import { setup, cleanup, core } from '../test-utils';
import { useThemeStore } from '../useThemeStore';
import { setThemeAppearanceSetting } from './setThemeAppearanceSetting';

describe('setThemeAppearanceSetting', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the setting value is invalid', () => {
    // Attempt to set an invalid theme appearance value.
    // Should throw a `InvalidParameterError`.
    // @ts-ignore
    expect(() => setThemeAppearanceSetting(core, 'invalid')).toThrowError(
      InvalidParameterError,
    );
  });

  it('sets the theme setting in the theme store', () => {
    // Set the theme appearance setting
    setThemeAppearanceSetting(core, 'dark');

    // Should set the setting in the theme store
    expect(useThemeStore.getState().appearanceSetting).toBe('dark');
  });

  it('dispatches a `theme:appearance:set-setting` event', (done) => {
    // Listen to `theme:appearance:set-setting` events
    core.addEventListener(`theme:appearance:set-setting`, (payload) => {
      // Payload data should be the new appearance setting
      expect(payload.data).toBe('dark');
      done();
    });

    // Set the theme appearance setting
    setThemeAppearanceSetting(core, 'dark');
  });
});
