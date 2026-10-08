import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EntityGroups } from '@minddrop/entity-groups';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { createFileSystemChange } from '@minddrop/file-system/test-utils';
import { i18n } from '@minddrop/i18n';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { ContentViewsStore } from '../ContentViewsStore';
import { ContentViewEntityType, ContentViewGroupsType } from '../constants';
import { ContentViewDeletedEvent } from '../events';
import { MockFs, cleanup, contentView_gallery_1, setup } from '../test-utils';
import { resolveContentViewFilePath } from '../utils';
import { initializeContentViews } from './initializeContentViews';

const { workspace_1 } = WorkspaceFixtures;

describe('initializeContentViews', () => {
  beforeEach(() => setup({}));

  afterEach(cleanup);

  it('applies content view file changes made outside of the app', async () => {
    initializeContentViews();

    // Delete the view file outside of the app
    const viewPath = resolveContentViewFilePath(contentView_gallery_1.id);
    MockFs.removeFile(viewPath);

    Events.dispatch(
      Fs.events.Changed,
      createFileSystemChange(viewPath, 'deleted', workspace_1.id),
    );

    await vi.advanceTimersByTimeAsync(0);

    expect(ContentViewsStore).not.toHaveItem(contentView_gallery_1.id);
  });

  it('registers the translations', () => {
    initializeContentViews();

    expect(i18n.t('contentViews.actions.add')).toBe('Add view');
  });

  it('registers the content view groups type', () => {
    // The fixtures register the type, so drop it to see the
    // initialization put it back.
    EntityGroups.unregisterType(ContentViewGroupsType);

    initializeContentViews();

    expect(EntityGroups.getConfig(ContentViewGroupsType).id).toBe(
      ContentViewGroupsType,
    );
  });

  it('lets a content view group hold only content views', () => {
    initializeContentViews();

    expect(EntityGroups.getConfig(ContentViewGroupsType).itemTypes).toEqual([
      ContentViewEntityType,
    ]);
  });

  it('files a content view under one group at most', () => {
    initializeContentViews();

    expect(
      EntityGroups.getConfig(ContentViewGroupsType).multiMembership,
    ).toBeFalsy();
  });

  it('gives the content views in no group an ungrouped group', () => {
    initializeContentViews();

    expect(EntityGroups.getConfig(ContentViewGroupsType).ungrouped).toBe(true);
  });

  it('drops a deleted content view from the group holding it', () => {
    initializeContentViews();

    expect(
      EntityGroups.getConfig(ContentViewGroupsType).itemDeletedEvents,
    ).toEqual([ContentViewDeletedEvent]);
  });
});
