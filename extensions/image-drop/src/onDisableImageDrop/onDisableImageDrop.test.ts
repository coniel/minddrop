import { initializeCore } from '@minddrop/core';
import { Drops } from '@minddrop/drops';
import { onRunImageDrop } from '../onRunImageDrop';
import { ImageDropConfig } from '../ImageDropConfig';
import { onDisableImageDrop } from './onDisableImageDrop';

const core = initializeCore({
  appId: 'app',
  extensionId: 'minddrop:drop:image',
});

describe('onDisableImageDrop', () => {
  beforeEach(() => {
    onRunImageDrop(core);
  });

  it('unregisters the text drop type', () => {
    // Disable the extension
    onDisableImageDrop(core);

    // 'image' drop type should no longer be registered
    expect(Drops.typeConfigsStore.get(ImageDropConfig.type)).toBeUndefined();
  });
});
