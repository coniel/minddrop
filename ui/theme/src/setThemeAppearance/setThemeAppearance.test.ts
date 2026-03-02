import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { ThemeConfig } from '../ThemeConfig';
import { ThemeDark } from '../constants';
import { cleanup, setup } from '../test-utils';
import { setThemeAppearance } from './setThemeAppearance';

describe('setThemeAppearance', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the appearance value is invalid', () => {
    // Attempt to set an invalid theme appearance value.
    // Should throw a `InvalidParameterError`.
    // @ts-expect-error Testing invalid input
    expect(() => setThemeAppearance('invalid')).toThrowError(
      InvalidParameterError,
    );
  });

  it('sets the theme appearance in the theme store', () => {
    // Set the theme appearance value
    setThemeAppearance(ThemeDark);

    // Should set the value in the theme store
    expect(ThemeConfig.get('appearance')).toBe(ThemeDark);
  });

  it('dispatches a `theme:appearance:set-value` event', () =>
    new Promise<void>((done) => {
      // Listen to `theme:appearance:set-value` events
      Events.addListener(`theme:appearance:set-value`, 'test', (payload) => {
        // Payload data should be the new appearance value
        expect(payload.data).toBe(ThemeDark);
        done();
      });

      // Set the theme appearance value
      setThemeAppearance(ThemeDark);
    }));
});
