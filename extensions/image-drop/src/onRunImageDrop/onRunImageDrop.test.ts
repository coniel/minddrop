import { initializeCore } from '@minddrop/core';
import { Drops } from '@minddrop/drops';
import { onRunImageDrop } from './onRunImageDrop';
import { ImageDropConfig } from '../ImageDropConfig';

const core = initializeCore({
  appId: 'app',
  extensionId: 'minddrop:drop:image',
});

describe('onRunImageDrop', () => {
  it('registers the `image` drop type', () => {
    // Run the extension
    onRunImageDrop(core);

    // 'image' drop type should be registered
    expect(Drops.getTypeConfig(ImageDropConfig.type)).toBeDefined();
  });
});
