import { EntityGroup, EntityGroupId } from '@minddrop/entity-groups';
import { MockFileDescriptor } from '@minddrop/file-system';
import { CollectionGroupsType } from '../constants';

// The date every fixture group was created and last changed
const fixtureDate = new Date('2024-01-01T00:00:00.000Z');

export const collectionGroup_1: EntityGroup = {
  id: 'entity-group_collection-group-1' as EntityGroupId,
  type: CollectionGroupsType,
  name: 'Collection group 1',
  items: [],
  created: fixtureDate,
  lastModified: fixtureDate,
};

export const collectionGroup_2: EntityGroup = {
  id: 'entity-group_collection-group-2' as EntityGroupId,
  type: CollectionGroupsType,
  name: 'Collection group 2',
  items: [],
  created: fixtureDate,
  lastModified: fixtureDate,
};

export const collectionGroups = [collectionGroup_1, collectionGroup_2];

// Spelled out rather than resolved, so that the fixtures pin the path
// down instead of agreeing with whatever the path utils produce.
const collectionGroupsFilePath =
  'path/to/workspaces/Workspace 1/.minddrop/entity-groups/collection-groups.json';

export function getCollectionGroupFiles(): (string | MockFileDescriptor)[] {
  return [
    {
      path: collectionGroupsFilePath,
      textContent: JSON.stringify(collectionGroups),
    },
  ];
}
