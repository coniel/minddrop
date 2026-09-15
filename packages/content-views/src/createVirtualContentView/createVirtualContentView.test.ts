import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { storeItem } from '@minddrop/stores/test-utils';
import { Icons } from '@minddrop/ui-icons';
import { ContentViewsStore } from '../ContentViewsStore';
import { ContentViewCreatedEvent } from '../events';
import {
  cleanup,
  contentViewType_gallery,
  mockDate,
  setup,
} from '../test-utils';
import { createVirtualContentView } from './createVirtualContentView';

const id = 'virtual-view-1';
const dataSource = { type: 'database' as const, id: 'database-1' };
const owner = 'database_owner-1' as const;

const expectedView = {
  id,
  virtual: true,
  owner,
  name: contentViewType_gallery.type,
  type: contentViewType_gallery.type,
  icon: Icons.fromName(contentViewType_gallery.icon),
  dataSource,
  created: mockDate,
  lastModified: mockDate,
  options: { ...contentViewType_gallery.defaultOptions },
  references: [],
};

describe('createVirtualContentView', () => {
  beforeEach(() => setup({ loadViews: false, loadViewFiles: false }));

  afterEach(cleanup);

  it('returns the new virtual view', () => {
    const result = createVirtualContentView({
      id,
      type: contentViewType_gallery.type,
      dataSource,
      owner,
    });

    expect(result).toEqual(expectedView);
  });

  it('adds the view to the store', () => {
    createVirtualContentView({
      id,
      type: contentViewType_gallery.type,
      dataSource,
      owner,
    });

    expect(ContentViewsStore).toHaveItem(id, expectedView);
  });

  it('uses the provided name', () => {
    const result = createVirtualContentView({
      id,
      type: contentViewType_gallery.type,
      dataSource,
      owner,
      name: 'Custom Name',
    });

    expect(result.name).toBe('Custom Name');
  });

  it('merges provided options over default options', () => {
    const result = createVirtualContentView({
      id,
      type: contentViewType_gallery.type,
      dataSource,
      owner,
      options: { sortProperty: 'Rating' },
    });

    expect(result.options).toEqual({
      ...contentViewType_gallery.defaultOptions,
      sortProperty: 'Rating',
    });
  });

  it('sets the owner key when provided', () => {
    const result = createVirtualContentView({
      id,
      type: contentViewType_gallery.type,
      dataSource,
      owner,
      ownerKey: 'layout_1:Related',
    });

    expect(result.ownerKey).toBe('layout_1:Related');
    expect(storeItem(ContentViewsStore, id).ownerKey).toBe('layout_1:Related');
  });

  it('sets provided data on the view', () => {
    const result = createVirtualContentView({
      id,
      type: contentViewType_gallery.type,
      dataSource,
      owner,
      data: { sortOrder: 'asc' },
    });

    expect(result.data).toEqual({ sortOrder: 'asc' });
  });

  it('dispatches a view created event', () =>
    new Promise<void>((done) => {
      Events.addListener(
        ContentViewCreatedEvent,
        'test-virtual-created',
        (payload) => {
          expect(payload).toEqual(expectedView);
          done();
        },
      );

      createVirtualContentView({
        id,
        type: contentViewType_gallery.type,
        dataSource,
        owner,
      });
    }));
});
