import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DesignRolesStore } from '../DesignRolesStore';
import { DesignsStore } from '../DesignsStore';
import { DesignsLoadedEvent, DesignsLoadedEventData } from '../events';
import { BuiltInDesignRoles } from '../roles';
import { DesignFixtures, MockFs, cleanup, setup } from '../test-utils';
import { resolveDesignFilePath } from '../utils';
import { initializeDesigns } from './initializeDesigns';

const { design_books, design_empty } = DesignFixtures;

describe('initializeDesigns', () => {
  beforeEach(() => setup({ loadDesigns: false, loadRoles: false }));
  afterEach(cleanup);

  it('registers the built-in design roles', async () => {
    await initializeDesigns();

    expect(DesignRolesStore.getAllArray()).toEqual(BuiltInDesignRoles);
  });

  it('loads designs from the file system into the store', async () => {
    await initializeDesigns();

    expect(DesignsStore.get(design_books.id)).toEqual(design_books);
    expect(DesignsStore.get(design_empty.id)).toEqual(design_empty);
  });

  it('skips entries which are not valid design bundles', async () => {
    MockFs.addFiles([
      {
        path: resolveDesignFilePath('design_invalid'),
        textContent: 'invalid json',
      },
    ]);

    await initializeDesigns();

    expect(DesignsStore.get('design_invalid')).toBeNull();
  });

  it('dispatches a designs loaded event', async () =>
    new Promise<void>((done) => {
      Events.addListener<DesignsLoadedEventData>(
        DesignsLoadedEvent,
        'test',
        (payload) => {
          expect(payload.data.length).toBeGreaterThan(0);
          done();
        },
      );

      initializeDesigns();
    }));
});
