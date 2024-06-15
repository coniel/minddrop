import { describe, afterEach, it, expect, beforeEach, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { cleanup } from '../test-utils';
import { BlockElementConfigsStore } from '../BlockElementConfigsStore';
import { unregisterBlockElementConfig } from './unregisterBlockElementConfig';
import { BlockElementConfig } from '../types';

const elementConfig: BlockElementConfig = {
  type: 'heading',
  fromMarkdown: vi.fn(),
  toMarkdown: vi.fn(),
};

describe('unregisterElementConfig', () => {
  beforeEach(() => {
    // Register a config
    BlockElementConfigsStore.add(elementConfig);
  });

  afterEach(cleanup);

  it('removes the config from the BlockElementConfigsStore', () => {
    // Unregister a config
    unregisterBlockElementConfig(elementConfig.type);

    // Should remove config from store
    expect(BlockElementConfigsStore.get(elementConfig.type)).toBeUndefined();
  });

  it('dispatches a `markdown:block-element:unregister` event', async () =>
    new Promise<void>(async (done) => {
      // Listen to 'markdown:block-element:unregister' events
      Events.addListener(
        'markdown:block-element:unregister',
        'test',
        (payload) => {
          // Payload data should be the unregistered config type
          expect(payload.data).toEqual(elementConfig.type);

          done();
        },
      );

      // Unregister a config
      unregisterBlockElementConfig(elementConfig.type);
    }));
});
