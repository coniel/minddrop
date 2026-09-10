import { afterEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DesignElementConfigsRegistry } from '../DesignElementConfigsRegistry';
import { DesignElementConfigRegisteredEvent } from '../events';
import { testElementConfig } from '../test-utils';
import { registerDesignElementConfig } from './registerDesignElementConfig';

describe('registerDesignElementConfig', () => {
  afterEach(() => {
    DesignElementConfigsRegistry.clear();
  });

  it('registers an element type config', () => {
    registerDesignElementConfig(testElementConfig);

    expect(DesignElementConfigsRegistry.get(testElementConfig.type)).toBe(
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
