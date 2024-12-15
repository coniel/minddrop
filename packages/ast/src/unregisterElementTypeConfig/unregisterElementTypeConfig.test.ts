import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { ElementTypeConfigsStore } from '../ElementTypeConfigsStore';
import { cleanup } from '../test-utils';
import { ElementTypeConfig } from '../types';
import { unregisterElementTypeConfig } from './unregisterElementTypeConfig';

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
