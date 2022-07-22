import { InvalidParameterError } from '@minddrop/utils';
import { setup, cleanup, core } from '../test-utils';
import { useThemeStore } from '../useThemeStore';
import { setThemeAppearance } from './setThemeAppearance';

describe('setThemeAppearance', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the appearance value is invalid', () => {
    // Attempt to set an invalid theme appearance value.
    // Should throw a `InvalidParameterError`.
    // @ts-ignore
    expect(() => setThemeAppearance(core, 'invalid')).toThrowError(
      InvalidParameterError,
    );
  });

  it('sets the theme appearance in the theme store', () => {
    // Set the theme appearance value
    setThemeAppearance(core, 'dark');

    // Should set the value in the theme store
    expect(useThemeStore.getState().appearance).toBe('dark');
  });

  it('dispatches a `theme:appearance:set-value` event', (done) => {
    // Listen to `theme:appearance:set-value` events
    core.addEventListener(`theme:appearance:set-value`, (payload) => {
      // Payload data should be the new appearance value
      expect(payload.data).toBe('dark');
      done();
    });

    // Set the theme appearance value
    setThemeAppearance(core, 'dark');
  });
});
