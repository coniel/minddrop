import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DesignsStore } from '../DesignsStore';
import { defaultLayouts } from '../default-layouts';
import { DesignNotFoundError, LayoutNotFoundError } from '../errors';
import { LayoutDeletedEvent, LayoutDeletedEventData } from '../events';
import {
  MockFs,
  cleanup,
  design_books,
  layout_card_1,
  setup,
} from '../test-utils';
import { Design } from '../types';
import { resolveDesignFilePath } from '../utils';
import { removeLayout } from './removeLayout';

describe('removeLayout', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the layout does not exist', async () => {
    await expect(() => removeLayout('non-existent-layout')).rejects.toThrow(
      LayoutNotFoundError,
    );
  });

  it('throws if the layout has no parent design (e.g. a default layout)', async () => {
    const defaultLayout = defaultLayouts[0];

    await expect(() => removeLayout(defaultLayout.id)).rejects.toThrow(
      DesignNotFoundError,
    );
  });

  it('returns the removed layout', async () => {
    const result = await removeLayout(layout_card_1.id);

    expect(result).toEqual(layout_card_1);
  });

  it('removes the layout from its parent design in the store', async () => {
    await removeLayout(layout_card_1.id);

    const parent = DesignsStore.get(design_books.id);

    expect(
      parent?.layouts.find((layout) => layout.id === layout_card_1.id),
    ).toBeUndefined();
  });

  it('persists the parent design to the file system', async () => {
    await removeLayout(layout_card_1.id);

    const written = MockFs.readJsonFile<Design>(
      resolveDesignFilePath(design_books.id),
    );

    expect(
      written?.layouts.find((layout) => layout.id === layout_card_1.id),
    ).toBeUndefined();
  });

  it('dispatches a layout deleted event', async () =>
    new Promise<void>((done) => {
      Events.addListener<LayoutDeletedEventData>(
        LayoutDeletedEvent,
        'test',
        (payload) => {
          expect(payload.data).toEqual(layout_card_1);
          done();
        },
      );

      removeLayout(layout_card_1.id);
    }));
});
