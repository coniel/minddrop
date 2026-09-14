import { afterEach, describe, expect, it } from 'vitest';
import { Collections } from '@minddrop/collections';
import { DataViews } from '@minddrop/data-views';
import { DatabaseEntries, Databases } from '@minddrop/databases';
import { EntityGroups } from '@minddrop/entity-groups';
import { Queries } from '@minddrop/queries';
import { Spaces } from '@minddrop/spaces';
import { Tags } from '@minddrop/tags';
import { cleanup } from '../../test-utils';
import {
  DatabasesSidebarGroupId,
  LibrarySidebarGroupId,
  SidebarGroupsType,
} from '../constants';
import { initializeSidebarGroups } from './initializeSidebarGroups';

describe('initializeSidebarGroups', () => {
  afterEach(cleanup);

  it('registers the sidebar groups type', () => {
    expect(() => EntityGroups.getConfig(SidebarGroupsType)).toThrow(
      EntityGroups.errors.NotRegistered,
    );

    initializeSidebarGroups();

    expect(EntityGroups.getConfig(SidebarGroupsType).id).toBe(
      SidebarGroupsType,
    );
  });

  it('lets a sidebar group hold every entity type the sidebar lists', () => {
    initializeSidebarGroups();

    expect(EntityGroups.getConfig(SidebarGroupsType).itemTypes).toEqual([
      Databases.constants.EntityType,
      DatabaseEntries.constants.EntityType,
      DataViews.constants.EntityType,
      Spaces.constants.EntityType,
      Collections.constants.EntityType,
      Queries.constants.EntityType,
      Tags.constants.EntityType,
    ]);
  });

  it('lets an item belong to several sidebar groups', () => {
    initializeSidebarGroups();

    expect(EntityGroups.getConfig(SidebarGroupsType).multiMembership).toBe(
      true,
    );
  });

  it('takes items dragged in from anywhere in the app', () => {
    initializeSidebarGroups();

    expect(EntityGroups.getConfig(SidebarGroupsType).acceptsExternalItems).toBe(
      true,
    );
  });

  it('provides the library and databases groups', () => {
    initializeSidebarGroups();

    expect(
      EntityGroups.getConfig(SidebarGroupsType).protectedGroups?.map(
        ({ id }) => id,
      ),
    ).toEqual([LibrarySidebarGroupId, DatabasesSidebarGroupId]);
  });

  it('drops a deleted item from the groups holding it', () => {
    initializeSidebarGroups();

    expect(EntityGroups.getConfig(SidebarGroupsType).itemDeletedEvents).toEqual(
      [
        Databases.events.Deleted,
        DatabaseEntries.events.Deleted,
        DataViews.events.Deleted,
        Spaces.events.Deleted,
        Collections.events.Deleted,
        Queries.events.Deleted,
        Tags.events.Deleted,
      ],
    );
  });
});
