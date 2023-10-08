import { describe, afterEach, it, expect, beforeEach } from 'vitest';
import { cleanup } from '../test-utils';
import { unregisterRichTextElementConfig } from './unregisterRichTextElementConfig';
import { paragraphElementConfig } from '../test-utils/rich-text-editor.data';
import { RichTextElementConfigsStore } from '../RichTextElementConfigsStore';
import { Events } from '@minddrop/events';

describe('unregisterRichTextElementConfig', () => {
  beforeEach(() => {
    // Register a config
    RichTextElementConfigsStore.set({
      id: paragraphElementConfig.type,
      ...paragraphElementConfig,
    });
  });

  afterEach(cleanup);

  it('removes the config from the RichTextElementConfigsStore', () => {
    // Unregister a config
    unregisterRichTextElementConfig(paragraphElementConfig.type);

    // Should remove config from store
    expect(
      RichTextElementConfigsStore.get(paragraphElementConfig.type),
    ).toBeUndefined();
  });

  it('dispatches a `rich-text-editor:element:register` event', async () =>
    new Promise<void>(async (done) => {
      // Listen to 'rich-text-editor:element:unregister' events
      Events.addListener(
        'rich-text-editor:element:unregister',
        'test',
        (payload) => {
          // Payload data should be the unregistered config type
          expect(payload.data).toEqual(paragraphElementConfig.type);

          done();
        },
      );

      // Unregister a config
      unregisterRichTextElementConfig(paragraphElementConfig.type);
    }));
});
