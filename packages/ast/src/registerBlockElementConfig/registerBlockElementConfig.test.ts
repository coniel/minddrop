import { describe, afterEach, it, expect, vi } from 'vitest';
import { cleanup } from '../test-utils';
import { registerBlockElementConfig } from './registerBlockElementConfig';
import { BlockElementConfigsStore } from '../BlockElementConfigsStore';
import { Events } from '@minddrop/events';
import { BlockElementConfig } from '../types';

const elementConfig: BlockElementConfig = {
  type: 'heading',
  fromMarkdown: vi.fn(),
  toMarkdown: vi.fn(),
};

describe('registerBlockElementConfig', () => {
  afterEach(cleanup);

  it('adds the config to the BlockElementConfigsStore', () => {
    // Register a config
    registerBlockElementConfig(elementConfig);

    // Should add config to store
    expect(BlockElementConfigsStore.get(elementConfig.type)).toEqual(
      elementConfig,
    );
  });

  it('dispatches a `markdown:block-element:register` event', () =>
    new Promise<void>((done) => {
      // Listen to 'markdown:block-element:register' events
      Events.addListener(
        'markdown:block-element:register',
        'test',
        (payload) => {
          // Payload data should be the registered config
          expect(payload.data).toEqual(elementConfig);

          done();
        },
      );

      // Register a config
      registerBlockElementConfig(elementConfig);
    }));
});
