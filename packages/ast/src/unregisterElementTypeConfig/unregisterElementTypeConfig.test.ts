import { describe, afterEach, it, expect, beforeEach, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { cleanup } from '../test-utils';
import { ElementTypeConfigsStore } from '../ElementTypeConfigsStore';
import { unregisterElementTypeConfig } from './unregisterElementTypeConfig';
import { ElementTypeConfig } from '../types';

const elementConfig: ElementTypeConfig = {
  type: 'heading',
  display: 'block',
  toMarkdown: vi.fn(),
};

describe('unregisterElementConfig', () => {
  beforeEach(() => {
    // Register a config
    ElementTypeConfigsStore.add(elementConfig);
  });

  afterEach(cleanup);

  it('removes the config from the ElementTypeConfigsStore', () => {
    // Unregister a config
    unregisterElementTypeConfig(elementConfig.type);

    // Should remove config from store
    expect(ElementTypeConfigsStore.get(elementConfig.type)).toBeUndefined();
  });

  it('dispatches a `markdown:element:unregister` event', () =>
    new Promise<void>((done) => {
      // Listen to 'markdown:element:unregister' events
      Events.addListener('markdown:element:unregister', 'test', (payload) => {
        // Payload data should be the unregistered config type
        expect(payload.data).toEqual(elementConfig.type);

        done();
      });

      // Unregister a config
      unregisterElementTypeConfig(elementConfig.type);
    }));
});
