import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { ThemeStore } from '../ThemeStore';
import { ImageDimmingLevel1, ImageDimmingLevel3 } from '../constants';
import { ImageDimmingChangedEvent } from '../events';
import { cleanup, setup } from '../test-utils';
import { setImageDimming } from './setImageDimming';

describe('setImageDimming', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the image dimming value is invalid', () => {
    // Attempt to set an invalid image dimming value.
    // Should throw a `InvalidParameterError`.
    // @ts-expect-error Testing invalid input
    expect(() => setImageDimming('invalid')).toThrowError(
      InvalidParameterError,
    );
  });

  it('sets the image dimming value in the theme store', () => {
    // Set the image dimming value
    setImageDimming(ImageDimmingLevel1);

    // Should set the value in the theme store
    expect(ThemeStore.get('imageDimming')).toBe(ImageDimmingLevel1);
  });

  it('dispatches a `theme:image-dimming:changed` event', () =>
    new Promise<void>((done) => {
      // Listen to `theme:image-dimming:changed` events
      Events.addListener(ImageDimmingChangedEvent, 'test', (payload) => {
        // Payload data should contain the image dimming value
        expect(payload.imageDimming).toBe(ImageDimmingLevel3);
        done();
      });

      // Set the image dimming value
      setImageDimming(ImageDimmingLevel3);
    }));
});
