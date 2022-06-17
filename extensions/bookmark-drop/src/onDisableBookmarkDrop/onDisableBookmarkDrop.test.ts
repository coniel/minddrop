import { initializeCore } from '@minddrop/core';
import { Drops } from '@minddrop/drops';
import { onRunBookmarkDrop } from '../onRunBookmarkDrop';
import { BookmarkDropConfig } from '../BookmarkDropConfig';
import { onDisableBookmarkDrop } from './onDisableBookmarkDrop';

const core = initializeCore({
  appId: 'app',
  extensionId: 'minddrop:drop:bookmark',
});

describe('onDisableBookmarkDrop', () => {
  beforeEach(() => {
    onRunBookmarkDrop(core);
  });

  it('unregisters the text drop type', () => {
    // Disable the extension
    onDisableBookmarkDrop(core);

    // 'bookmark' drop type should no longer be registered
    expect(Drops.typeConfigsStore.get(BookmarkDropConfig.type)).toBeUndefined();
  });
});
