import { describe, afterEach, it, expect, beforeEach } from 'vitest';
import { cleanup } from '../test-utils';
import { unregisterRichTextMarkConfig } from './unregisterRichTextMarkConfig';
import { boldMarkConfig } from '../test-utils/rich-text-editor.data';
import { RichTextMarkConfigsStore } from '../RichTextMarkConfigsStore';
import { Events } from '@minddrop/events';

describe('unregisterRichTextMarkConfig', () => {
  beforeEach(() => {
    // Register a config
    RichTextMarkConfigsStore.set({
      id: boldMarkConfig.key,
      ...boldMarkConfig,
    });
  });

  afterEach(cleanup);

  it('removes the config from the RichTextMarkConfigsStore', () => {
    // Unregister a config
    unregisterRichTextMarkConfig(boldMarkConfig.key);

    // Should remove config from store
    expect(RichTextMarkConfigsStore.get(boldMarkConfig.key)).toBeUndefined();
  });

  it('dispatches a `rich-text-editor:mark:register` event', async () =>
    new Promise<void>(async (done) => {
      // Listen to 'rich-text-editor:mark:unregister' events
      Events.addListener(
        'rich-text-editor:mark:unregister',
        'test',
        (payload) => {
          // Payload data should be the unregistered config key
          expect(payload.data).toEqual(boldMarkConfig.key);

          done();
        },
      );

      // Unregister a config
      unregisterRichTextMarkConfig(boldMarkConfig.key);
    }));
});
