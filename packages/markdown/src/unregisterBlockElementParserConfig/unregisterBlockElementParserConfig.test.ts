import { describe, afterEach, it, expect, beforeEach, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { cleanup } from '../test-utils';
import { BlockElementParserConfigsStore } from '../BlockElementParserConfigsStore';
import { BlockElementParserConfig } from '../types';
import { unregisterBlockElementParserConfig } from './unregisterBlockElementParserConfig';

const parserConfig: BlockElementParserConfig = {
  type: 'heading',
  parser: vi.fn(),
};

describe('unregisterElementConfig', () => {
  beforeEach(() => {
    // Register a config
    BlockElementParserConfigsStore.set({
      id: parserConfig.type,
      ...parserConfig,
    });
  });

  afterEach(cleanup);

  it('removes the config from the BlockElementParserConfigsStore', () => {
    // Unregister a config
    unregisterBlockElementParserConfig(parserConfig.type);

    // Should remove config from store
    expect(
      BlockElementParserConfigsStore.get(parserConfig.type),
    ).toBeUndefined();
  });

  it('dispatches a `markdown:block-element-parser:unregister` event', async () =>
    new Promise<void>(async (done) => {
      // Listen to 'markdown:block-element-parser:unregister' events
      Events.addListener(
        'markdown:block-element-parser:unregister',
        'test',
        (payload) => {
          // Payload data should be the unregistered config type
          expect(payload.data).toEqual(parserConfig.type);

          done();
        },
      );

      // Unregister a config
      unregisterBlockElementParserConfig(parserConfig.type);
    }));
});
