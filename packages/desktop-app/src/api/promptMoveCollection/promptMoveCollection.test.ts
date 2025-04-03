import { describe, expect, it, vi } from 'vitest';
import { Collections } from '@minddrop/collections';
import { promptMoveCollection } from './promptMoveCollection';

const COLLECTION_PATH = 'path/to/Collection';

let openResponse: string | null;

vi.mock('@tauri-apps/plugin-dialog', () => ({
  open: () => openResponse,
}));

describe('promptMoveCollection', () => {
  it('moves the collection when a dir is selected', async () => {
    vi.spyOn(Collections, 'move');

    // Pretend dir was selected
    openResponse = 'new/path';

    // Run the prompt
    await promptMoveCollection(COLLECTION_PATH);

    // Should move the collection to the new path
    expect(Collections.move).toHaveBeenCalledWith(
      COLLECTION_PATH,
      openResponse,
    );
  });

  it('does nothing if no dir was selected', async () => {
    vi.spyOn(Collections, 'move');

    // Pretend dir selection was canceled
    openResponse = null;

    // Run the prompt
    await promptMoveCollection(COLLECTION_PATH);

    // Should not attempt to move the collection
    expect(Collections.move).not.toHaveBeenCalled();
  });
});
