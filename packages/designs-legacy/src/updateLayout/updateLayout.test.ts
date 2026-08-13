import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { DesignsStore } from '../DesignsStore';
import { defaultLayouts } from '../default-layouts';
import { DesignNotFoundError, LayoutNotFoundError } from '../errors';
import { LayoutUpdatedEvent, LayoutUpdatedEventData } from '../events';
import {
  MockFs,
  cleanup,
  design_books,
  layout_card_1,
  setup,
} from '../test-utils';
import { Design, Layout } from '../types';
import { resolveDesignFilePath } from '../utils';
import { updateLayout } from './updateLayout';

const lastModified = new Date('2000-01-01T00:00:00.000Z');
const update = { name: 'Renamed card', description: 'A renamed card layout' };
const updatedLayout: Layout = {
  ...layout_card_1,
  ...update,
  lastModified,
};

describe('updateLayout', () => {
  beforeEach(() => {
    setup();
    vi.setSystemTime(lastModified);
  });

  afterEach(cleanup);

  it('throws if the layout does not exist', async () => {
    await expect(() =>
      updateLayout('non-existent-layout', update),
    ).rejects.toThrow(LayoutNotFoundError);
  });

  it('throws if the layout has no parent design (e.g. a default layout)', async () => {
    const defaultLayout = defaultLayouts[0];

    await expect(() => updateLayout(defaultLayout.id, update)).rejects.toThrow(
      DesignNotFoundError,
    );
  });

  it('returns the updated layout', async () => {
    const result = await updateLayout(layout_card_1.id, update);

    expect(result).toEqual(updatedLayout);
  });

  it('updates the layout inside its parent design in the store', async () => {
    await updateLayout(layout_card_1.id, update);

    const parent = DesignsStore.get(design_books.id);

    expect(parent?.layouts.find((l) => l.id === layout_card_1.id)).toEqual(
      updatedLayout,
    );
  });

  it('persists the parent design to the file system', async () => {
    await updateLayout(layout_card_1.id, update);

    const written = MockFs.readJsonFile<Design>(
      resolveDesignFilePath(design_books.id),
    );

    expect(written?.layouts.find((l) => l.id === layout_card_1.id)).toEqual(
      updatedLayout,
    );
  });

  it('dispatches a layout updated event', async () =>
    new Promise<void>((done) => {
      Events.addListener<LayoutUpdatedEventData>(
        LayoutUpdatedEvent,
        'test',
        (payload) => {
          expect(payload.data.original).toEqual(layout_card_1);
          expect(payload.data.updated).toEqual(updatedLayout);
          done();
        },
      );

      updateLayout(layout_card_1.id, update);
    }));
});
