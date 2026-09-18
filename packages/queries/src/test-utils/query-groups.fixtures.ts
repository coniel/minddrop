import { EntityGroup, EntityGroupId } from '@minddrop/entity-groups';
import { MockFileDescriptor } from '@minddrop/file-system';
import { QueryGroupsType } from '../constants';

// The date every fixture group was created and last changed
const fixtureDate = new Date('2024-01-01T00:00:00.000Z');

export const queryGroup_1: EntityGroup = {
  id: 'entity-group_query-group-1' as EntityGroupId,
  type: QueryGroupsType,
  name: 'Query group 1',
  items: [],
  created: fixtureDate,
  lastModified: fixtureDate,
};

export const queryGroup_2: EntityGroup = {
  id: 'entity-group_query-group-2' as EntityGroupId,
  type: QueryGroupsType,
  name: 'Query group 2',
  items: [],
  created: fixtureDate,
  lastModified: fixtureDate,
};

export const queryGroups = [queryGroup_1, queryGroup_2];

// Spelled out rather than resolved, so that the fixtures pin the path
// down instead of agreeing with whatever the path utils produce.
const queryGroupsFilePath =
  'path/to/workspaces/Workspace 1/.minddrop/entity-groups/query-groups.json';

export function getQueryGroupFiles(): (string | MockFileDescriptor)[] {
  return [
    { path: queryGroupsFilePath, textContent: JSON.stringify(queryGroups) },
  ];
}
