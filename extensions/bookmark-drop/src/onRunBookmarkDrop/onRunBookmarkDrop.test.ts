import { initializeCore } from '@minddrop/core';
import { Drops } from '@minddrop/drops';
import { onRunBookmarkDrop } from './onRunBookmarkDrop';
import { BookmarkDropConfig } from '../BookmarkDropConfig';

const core = initializeCore({
  appId: 'app',
  extensionId: 'minddrop:drop:bookmark',
});

describe('onRunBookmarkDrop', () => {
  it('registers the `bookmark` drop type', () => {
    // Run the extension
    onRunBookmarkDrop(core);

    // 'bookmark' drop type should be registered
    expect(Drops.getTypeConfig(BookmarkDropConfig.type)).toBeDefined();
  });
});
