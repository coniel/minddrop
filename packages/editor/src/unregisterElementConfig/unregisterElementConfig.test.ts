import { describe, afterEach, it, expect, beforeEach } from 'vitest';
import { cleanup } from '../test-utils';
import { unregisterElementConfig } from './unregisterElementConfig';
import { paragraphElementConfig } from '../test-utils/editor.data';
import { ElementConfigsStore } from '../ElementConfigsStore';
import { Events } from '@minddrop/events';

describe('unregisterElementConfig', () => {
  beforeEach(() => {
    // Register a config
    ElementConfigsStore.set({
      id: paragraphElementConfig.type,
      ...paragraphElementConfig,
    });
  });

  afterEach(cleanup);

  it('removes the config from the ElementConfigsStore', () => {
    // Unregister a config
    unregisterElementConfig(paragraphElementConfig.type);

    // Should remove config from store
    expect(
      ElementConfigsStore.get(paragraphElementConfig.type),
    ).toBeUndefined();
  });

  it('dispatches a `editor:element:register` event', () =>
    new Promise<void>((done) => {
      // Listen to 'editor:element:unregister' events
      Events.addListener('editor:element:unregister', 'test', (payload) => {
        // Payload data should be the unregistered config type
        expect(payload.data).toEqual(paragraphElementConfig.type);

        done();
      });

      // Unregister a config
      unregisterElementConfig(paragraphElementConfig.type);
    }));
});
