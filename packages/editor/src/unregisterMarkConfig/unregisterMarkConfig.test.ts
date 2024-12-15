import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { MarkConfigsStore } from '../MarkConfigsStore';
import { cleanup } from '../test-utils';
import { boldMarkConfig } from '../test-utils/editor.data';
import { unregisterMarkConfig } from './unregisterMarkConfig';

describe('unregisterMarkConfig', () => {
  beforeEach(() => {
    // Register a config
    MarkConfigsStore.set({
      id: boldMarkConfig.key,
      ...boldMarkConfig,
    });
  });

  afterEach(cleanup);

  it('removes the config from the MarkConfigsStore', () => {
    // Unregister a config
    unregisterMarkConfig(boldMarkConfig.key);

    // Should remove config from store
    expect(MarkConfigsStore.get(boldMarkConfig.key)).toBeUndefined();
  });

  it('dispatches a `editor:mark:register` event', () =>
    new Promise<void>((done) => {
      // Listen to 'editor:mark:unregister' events
      Events.addListener('editor:mark:unregister', 'test', (payload) => {
        // Payload data should be the unregistered config key
        expect(payload.data).toEqual(boldMarkConfig.key);

        done();
      });

      // Unregister a config
      unregisterMarkConfig(boldMarkConfig.key);
    }));
});
