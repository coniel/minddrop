import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { InvalidParameterError } from '@minddrop/utils';
import { Events } from '@minddrop/events';
import { setup, cleanup } from '../test-utils';
import { ThemeConfig } from '../ThemeConfig';
import { setThemeAppearanceSetting } from './setThemeAppearanceSetting';
import { ThemeDark } from '../constants';

describe('setThemeAppearanceSetting', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the setting value is invalid', () => {
    // Attempt to set an invalid theme appearance value.
    // Should throw a `InvalidParameterError`.
    // @ts-expect-error Testing invalid input
    expect(() => setThemeAppearanceSetting('invalid')).toThrowError(
      InvalidParameterError,
    );
  });

  it('sets the theme setting in the theme store', () => {
    // Set the theme appearance setting
    setThemeAppearanceSetting(ThemeDark);

    // Should set the setting in the theme store
    expect(ThemeConfig.get('appearanceSetting')).toBe(ThemeDark);
  });

  it('dispatches a `theme:appearance:set-setting` event', () =>
    new Promise<void>((done) => {
      // Listen to `theme:appearance:set-setting` events
      Events.addListener(`theme:appearance:set-setting`, 'test', (payload) => {
        // Payload data should be the new appearance setting
        expect(payload.data).toBe(ThemeDark);
        done();
      });

      // Set the theme appearance setting
      setThemeAppearanceSetting(ThemeDark);
    }));
});
