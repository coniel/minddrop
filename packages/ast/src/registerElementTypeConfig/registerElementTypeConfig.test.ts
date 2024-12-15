import { describe, afterEach, it, expect, vi } from 'vitest';
import { cleanup } from '../test-utils';
import { registerElementTypeConfig } from './registerElementTypeConfig';
import { ElementTypeConfigsStore } from '../ElementTypeConfigsStore';
import { Events } from '@minddrop/events';
import { ElementTypeConfig } from '../types';

const elementConfig: ElementTypeConfig = {
  type: 'heading',
  display: 'block',
  toMarkdown: vi.fn(),
};

describe('registerElementTypeConfig', () => {
  afterEach(cleanup);

  it('adds the config to the ElementTypeConfigsStore', () => {
    // Register a config
    registerElementTypeConfig(elementConfig);

    // Should add config to store
    expect(ElementTypeConfigsStore.get(elementConfig.type)).toEqual(
      elementConfig,
    );
  });

  it('dispatches a `markdown:element:register` event', () =>
    new Promise<void>((done) => {
      // Listen to 'markdown:element:register' events
      Events.addListener('markdown:element:register', 'test', (payload) => {
        // Payload data should be the registered config
        expect(payload.data).toEqual(elementConfig);

        done();
      });

      // Register a config
      registerElementTypeConfig(elementConfig);
    }));
});
