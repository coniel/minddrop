import { afterEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DesignElementConfigsStore } from '../DesignElementConfigsStore';
import { DesignElementConfigRegisteredEvent } from '../events';
import { getDesignElementConfig } from '../getDesignElementConfig';
import { testElementConfig } from '../test-utils';
import { registerDesignElementConfig } from './registerDesignElementConfig';

describe('registerDesignElementConfig', () => {
  afterEach(() => {
    DesignElementConfigsStore.clear();
  });

  it('registers an element type config', () => {
    registerDesignElementConfig(testElementConfig);

    expect(getDesignElementConfig(testElementConfig.type)).toBe(
      testElementConfig,
    );
  });

  it('dispatches the element type registered event', () =>
    new Promise<void>((done) => {
      Events.addListener(
        DesignElementConfigRegisteredEvent,
        'test',
        (payload) => {
          expect(payload).toBe(testElementConfig);
          done();
        },
      );

      registerDesignElementConfig(testElementConfig);
    }));
});
