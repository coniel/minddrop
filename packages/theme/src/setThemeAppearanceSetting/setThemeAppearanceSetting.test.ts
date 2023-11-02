import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { InvalidParameterError } from '@minddrop/utils';
import { setup, cleanup, core } from '../test-utils';
import { ThemeConfig } from '../ThemeConfig';
import { setThemeAppearanceSetting } from './setThemeAppearanceSetting';
import { ThemeDark } from '../constants';

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
    setThemeAppearanceSetting(core, ThemeDark);

    // Should set the setting in the theme store
    expect(ThemeConfig.get('appearanceSetting')).toBe(ThemeDark);
  });

  it('dispatches a `theme:appearance:set-setting` event', () =>
    new Promise<void>((done) => {
      // Listen to `theme:appearance:set-setting` events
      core.addEventListener(`theme:appearance:set-setting`, (payload) => {
        // Payload data should be the new appearance setting
        expect(payload.data).toBe(ThemeDark);
        done();
      });

      // Set the theme appearance setting
      setThemeAppearanceSetting(core, ThemeDark);
    }));
});
