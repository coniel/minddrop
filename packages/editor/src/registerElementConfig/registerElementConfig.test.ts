import { describe, afterEach, it, expect } from 'vitest';
import { Events } from '@minddrop/events';
import { cleanup } from '../test-utils';
import { paragraphElementConfig } from '../test-utils/editor.data';
import { ElementConfigsStore } from '../ElementConfigsStore';
import { registerElementConfig } from './registerElementConfig';

describe('registerElementConfig', () => {
  afterEach(cleanup);

  it('adds the config to the ElementConfigsStore', () => {
    // Register a config
    registerElementConfig(paragraphElementConfig);

    // Should add config to store
    expect(ElementConfigsStore.get(paragraphElementConfig.type)).toEqual({
      id: paragraphElementConfig.type,
      ...paragraphElementConfig,
    });
  });

  it('dispatches a `editor:element:register` event', () =>
    new Promise<void>((done) => {
      // Listen to 'editor:element:register' events
      Events.addListener('editor:element:register', 'test', (payload) => {
        // Payload data should be the registered config
        expect(payload.data).toEqual({
          id: paragraphElementConfig.type,
          ...paragraphElementConfig,
        });

        done();
      });

      // Register a config
      registerElementConfig(paragraphElementConfig);
    }));
});
