import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { ThemeStore } from '../ThemeStore';
import { ThemeDark, ThemeLight } from '../constants';
import { VariantChangedEvent, VariantChangedEventData } from '../events';
import { cleanup, setup } from '../test-utils';
import { setThemeVariant } from './setThemeVariant';

describe('setThemeVariant', () => {
  beforeEach(() => {
    setup();

    // Mock matchMedia for resolveThemeVariant
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: false,
      })),
    });
  });

  afterEach(cleanup);

  it('throws if the variant value is invalid', () => {
    // Attempt to set an invalid theme variant.
    // Should throw a `InvalidParameterError`.
    // @ts-expect-error Testing invalid input
    expect(() => setThemeVariant('invalid')).toThrowError(
      InvalidParameterError,
    );
  });

  it('sets the theme variant in the theme store', () => {
    // Set the theme variant
    setThemeVariant(ThemeDark);

    // Should set the variant in the theme store
    expect(ThemeStore.get('variant')).toBe(ThemeDark);
  });

  it('dispatches a `theme:variant:changed` event', () =>
    new Promise<void>((done) => {
      // Listen to `theme:variant:changed` events
      Events.addListener<VariantChangedEventData>(
        VariantChangedEvent,
        'test',
        (payload) => {
          // Payload data should contain the variant and resolved appearance
          expect(payload.data.variant).toBe(ThemeDark);
          expect(payload.data.resolvedAppearance).toBe(ThemeDark);
          done();
        },
      );

      // Set the theme variant
      setThemeVariant(ThemeDark);
    }));

  it('dispatches with resolved appearance for fixed variants', () =>
    new Promise<void>((done) => {
      // Listen to `theme:variant:changed` events
      Events.addListener<VariantChangedEventData>(
        VariantChangedEvent,
        'test',
        (payload) => {
          // For a 'light' variant, resolved appearance should be 'light'
          expect(payload.data.resolvedAppearance).toBe(ThemeLight);
          done();
        },
      );

      // Set the theme variant to 'light'
      setThemeVariant(ThemeLight);
    }));
});
