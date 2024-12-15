import { afterEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { MarkConfigsStore } from '../MarkConfigsStore';
import { boldMarkConfig } from '../default-mark-configs';
import { cleanup } from '../test-utils';
import { registerMarkConfig } from './registerMarkConfig';

describe('registerMarkConfig', () => {
  afterEach(cleanup);

  it('adds the config to the MarkConfigsStore', () => {
    // Register a config
    registerMarkConfig(boldMarkConfig);

    // Should add config to store
    expect(MarkConfigsStore.get(boldMarkConfig.key)).toEqual({
      id: boldMarkConfig.key,
      ...boldMarkConfig,
    });
  });

  it('dispatches a `editor:mark:register` event', () =>
    new Promise<void>((done) => {
      // Listen to 'editor:mark:register' events
      Events.addListener('editor:mark:register', 'test', (payload) => {
        // Payload data should be the registered config
        expect(payload.data).toEqual({
          id: boldMarkConfig.key,
          ...boldMarkConfig,
        });

        done();
      });

      // Register a config
      registerMarkConfig(boldMarkConfig);
    }));
});
