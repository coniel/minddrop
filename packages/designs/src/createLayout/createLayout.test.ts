import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import { DesignsStore } from '../DesignsStore';
import { DesignNotFoundError } from '../errors';
import { LayoutCreatedEvent, LayoutCreatedEventData } from '../events';
import { MockFs, cleanup, design_empty, setup } from '../test-utils';
import { Design, Layout } from '../types';
import { getDesignFilePath } from '../utils';
import { createLayout } from './createLayout';

const created = new Date('2000-01-01T00:00:00.000Z');

const newLayout: Layout = {
  id: expect.any(String) as unknown as string,
  type: 'card',
  name: 'My card',
  tree: {
    id: 'root',
    type: 'root',
    style: expect.any(Object) as unknown as Layout['tree']['style'],
    children: [],
  },
  frame: { x: 0, y: 0, width: 380 },
  created,
  lastModified: created,
};

describe('createLayout', () => {
  beforeEach(() => {
    setup();
    vi.setSystemTime(created);
  });

  afterEach(cleanup);

  it('throws if the parent design does not exist', async () => {
    await expect(() =>
      createLayout('non-existent-design', 'card'),
    ).rejects.toThrow(DesignNotFoundError);
  });

  it('returns the new layout', async () => {
    const result = await createLayout(design_empty.id, 'card', 'My card');

    expect(result).toMatchObject(newLayout);
  });

  it('appends the layout to the parent design', async () => {
    const result = await createLayout(design_empty.id, 'card', 'My card');

    expect(DesignsStore.get(design_empty.id)?.layouts).toEqual([result]);
  });

  it('preserves existing layouts on the parent design', async () => {
    const first = await createLayout(design_empty.id, 'card', 'First');
    const second = await createLayout(design_empty.id, 'list', 'Second');

    expect(DesignsStore.get(design_empty.id)?.layouts).toEqual([first, second]);
  });

  it('persists the parent design to the file system', async () => {
    const result = await createLayout(design_empty.id, 'card', 'My card');

    const written = MockFs.readJsonFile<Design>(
      getDesignFilePath(design_empty.id),
    );

    expect(written?.layouts).toEqual([result]);
  });

  it('defaults the layout name to the localized type label', async () => {
    const result = await createLayout(design_empty.id, 'card');

    expect(result.name).toBe(i18n.t('designs.layouts.card.label'));
  });

  it('uses the default frame for the given layout type', async () => {
    const card = await createLayout(design_empty.id, 'card');
    const list = await createLayout(design_empty.id, 'list');
    const page = await createLayout(design_empty.id, 'page');

    expect(card.frame).toEqual({ x: 0, y: 0, width: 380 });
    expect(list.frame).toEqual({ x: 0, y: 0, width: 600 });
    expect(page.frame).toEqual({ x: 0, y: 0, width: 800, height: 600 });
  });

  it('positions the frame at the given position', async () => {
    const result = await createLayout(design_empty.id, 'card', 'My card', {
      x: 120,
      y: 240,
    });

    expect(result.frame).toEqual({ x: 120, y: 240, width: 380 });
  });

  it('dispatches a layout created event', async () =>
    new Promise<void>((done) => {
      Events.addListener<LayoutCreatedEventData>(
        LayoutCreatedEvent,
        'test',
        (payload) => {
          expect(payload.data).toMatchObject(newLayout);
          done();
        },
      );

      createLayout(design_empty.id, 'card', 'My card');
    }));
});
