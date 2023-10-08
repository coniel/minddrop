import { describe, afterEach, it, expect } from 'vitest';
import { cleanup } from '../test-utils';
import { registerRichTextElementConfig } from './registerRichTextElementConfig';
import { paragraphElementConfig } from '../test-utils/rich-text-editor.data';
import { RichTextElementConfigsStore } from '../RichTextElementConfigsStore';
import { Events } from '@minddrop/events';

describe('registerRichTextElementConfig', () => {
  afterEach(cleanup);

  it('adds the config to the RichTextElementConfigsStore', () => {
    // Register a config
    registerRichTextElementConfig(paragraphElementConfig);

    // Should add config to store
    expect(
      RichTextElementConfigsStore.get(paragraphElementConfig.type),
    ).toEqual({
      id: paragraphElementConfig.type,
      ...paragraphElementConfig,
    });
  });

  it('dispatches a `rich-text-editor:element:register` event', async () =>
    new Promise<void>(async (done) => {
      // Listen to 'rich-text-editor:element:register' events
      Events.addListener(
        'rich-text-editor:element:register',
        'test',
        (payload) => {
          // Payload data should be the registered config
          expect(payload.data).toEqual({
            id: paragraphElementConfig.type,
            ...paragraphElementConfig,
          });

          done();
        },
      );

      // Register a config
      registerRichTextElementConfig(paragraphElementConfig);
    }));
});
