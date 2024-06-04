import { describe, afterEach, it, expect, vi } from 'vitest';
import { cleanup } from '../test-utils';
import { registerBlockElementParserConfig } from './registerBlockElementParserConfig';
import { BlockElementParserConfigsStore } from '../BlockElementParserConfigsStore';
import { Events } from '@minddrop/events';
import { BlockElementParserConfig } from '../types';

const parserConfig: BlockElementParserConfig = {
  type: 'heading',
  parser: vi.fn(),
};

describe('registerBlockElementParserConfig', () => {
  afterEach(cleanup);

  it('adds the config to the BlockElementParserConfigsStore', () => {
    // Register a config
    registerBlockElementParserConfig(parserConfig);

    // Should add config to store
    expect(BlockElementParserConfigsStore.get(parserConfig.type)).toEqual({
      id: parserConfig.type,
      ...parserConfig,
    });
  });

  it('dispatches a `markdown:block-element-parser:register` event', async () =>
    new Promise<void>(async (done) => {
      // Listen to 'markdown:block-element-parser:register' events
      Events.addListener(
        'markdown:block-element-parser:register',
        'test',
        (payload) => {
          // Payload data should be the registered config
          expect(payload.data).toEqual({
            id: parserConfig.type,
            ...parserConfig,
          });

          done();
        },
      );

      // Register a config
      registerBlockElementParserConfig(parserConfig);
    }));
});
