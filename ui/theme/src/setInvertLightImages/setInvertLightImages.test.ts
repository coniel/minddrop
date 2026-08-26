import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { ThemeStore } from '../ThemeStore';
import { InvertLightImagesChangedEvent } from '../events';
import { cleanup, setup } from '../test-utils';
import { setInvertLightImages } from './setInvertLightImages';

describe('setInvertLightImages', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('sets the value in the theme store', () => {
    // Enable light image inversion
    setInvertLightImages(true);

    // Should set the value in the theme store
    expect(ThemeStore.get('invertLightImages')).toBe(true);
  });

  it('dispatches a `theme:invert-light-images:changed` event', () =>
    new Promise<void>((done) => {
      // Listen to `theme:invert-light-images:changed` events
      Events.addListener(InvertLightImagesChangedEvent, 'test', (payload) => {
        // Payload data should contain the setting value
        expect(payload.data.invertLightImages).toBe(true);
        done();
      });

      // Enable light image inversion
      setInvertLightImages(true);
    }));
});
