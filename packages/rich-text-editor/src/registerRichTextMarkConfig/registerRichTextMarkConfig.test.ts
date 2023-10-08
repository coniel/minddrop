import { describe, afterEach, it, expect } from 'vitest';
import { cleanup } from '../test-utils';
import { registerRichTextMarkConfig } from './registerRichTextMarkConfig';
import { boldMarkConfig } from '../default-mark-configs';
import { RichTextMarkConfigsStore } from '../RichTextMarkConfigsStore';
import { Events } from '@minddrop/events';

describe('registerRichTextMarkConfig', () => {
  afterEach(cleanup);

  it('adds the config to the RichTextMarkConfigsStore', () => {
    // Register a config
    registerRichTextMarkConfig(boldMarkConfig);

    // Should add config to store
    expect(RichTextMarkConfigsStore.get(boldMarkConfig.key)).toEqual({
      id: boldMarkConfig.key,
      ...boldMarkConfig,
    });
  });

  it('dispatches a `rich-text-editor:mark:register` event', async () =>
    new Promise<void>(async (done) => {
      // Listen to 'rich-text-editor:mark:register' events
      Events.addListener(
        'rich-text-editor:mark:register',
        'test',
        (payload) => {
          // Payload data should be the registered config
          expect(payload.data).toEqual({
            id: boldMarkConfig.key,
            ...boldMarkConfig,
          });

          done();
        },
      );

      // Register a config
      registerRichTextMarkConfig(boldMarkConfig);
    }));
});
