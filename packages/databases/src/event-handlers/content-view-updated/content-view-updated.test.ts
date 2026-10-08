import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { storeItem } from '@minddrop/stores/test-utils';
import { EntriesStore } from '../../EntriesStore';
import { ensureEntryVirtualView } from '../../ensureEntryVirtualView';
import {
  cleanup,
  collectionEntry1,
  relatedPropertyName,
  setup,
} from '../../test-utils';
import { embeddedViewConfigKey, virtualCollectionId } from '../../utils';
import { onUpdateContentView } from './content-view-updated';

const { contentViewType_board } = ContentViewFixtures;

// The ID of the design element embedding the view
const elementId = 'element_related';

describe('onUpdateContentView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("persists an entry owned view's config into the entry's metadata", async () => {
    // Create the embedded board for the entry's Related collection
    const board = ensureEntryVirtualView(
      virtualCollectionId(collectionEntry1.id, relatedPropertyName),
      elementId,
      contentViewType_board.type,
    );

    await onUpdateContentView({
      original: board,
      updated: { ...board, data: { columns: [['a', 'b'], ['c']] } },
    });

    expect(
      storeItem(EntriesStore, collectionEntry1.id).metadata
        .embeddedViewConfigs?.[
        embeddedViewConfigKey(elementId, contentViewType_board.type)
      ],
    ).toEqual({
      options: contentViewType_board.defaultOptions,
      data: { columns: [['a', 'b'], ['c']] },
    });
  });
});
