import { EntityGroup, EntityGroupId } from '@minddrop/entity-groups';
import { MockFileDescriptor } from '@minddrop/file-system';
import { SpaceGroupsType } from '../constants';

// The date every fixture group was created and last changed
const fixtureDate = new Date('2024-01-01T00:00:00.000Z');

export const spaceGroup_1: EntityGroup = {
  id: 'entity-group_space-group-1' as EntityGroupId,
  type: SpaceGroupsType,
  name: 'Space group 1',
  items: [],
  created: fixtureDate,
  lastModified: fixtureDate,
};

export const spaceGroup_2: EntityGroup = {
  id: 'entity-group_space-group-2' as EntityGroupId,
  type: SpaceGroupsType,
  name: 'Space group 2',
  items: [],
  created: fixtureDate,
  lastModified: fixtureDate,
};

export const spaceGroups = [spaceGroup_1, spaceGroup_2];

// Spelled out rather than resolved, so that the fixtures pin the path
// down instead of agreeing with whatever the path utils produce.
const spaceGroupsFilePath =
  'path/to/workspaces/Workspace 1/.minddrop/entity-groups/space-groups.json';

export function getSpaceGroupFiles(): (string | MockFileDescriptor)[] {
  return [
    { path: spaceGroupsFilePath, textContent: JSON.stringify(spaceGroups) },
  ];
}
