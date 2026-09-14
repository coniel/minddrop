import { EntityGroup, EntityGroupId } from '@minddrop/entity-groups';
import { MockFileDescriptor } from '@minddrop/file-system';
import { TagGroupsType } from '../constants';

// The date every fixture group was created and last changed
const fixtureDate = new Date('2024-01-01T00:00:00.000Z');

export const tagGroup_1: EntityGroup = {
  id: 'entity-group_tag-group-1' as EntityGroupId,
  type: TagGroupsType,
  name: 'Group 1',
  items: [],
  created: fixtureDate,
  lastModified: fixtureDate,
};

export const tagGroup_2: EntityGroup = {
  id: 'entity-group_tag-group-2' as EntityGroupId,
  type: TagGroupsType,
  name: 'Group 2',
  items: [],
  created: fixtureDate,
  lastModified: fixtureDate,
};

export const tagGroups = [tagGroup_1, tagGroup_2];

// Spelled out rather than resolved, so that the fixtures pin the path
// down instead of agreeing with whatever the path utils produce.
const tagGroupsFilePath =
  'path/to/workspaces/Workspace 1/.minddrop/entity-groups/tag-groups.json';

export function getTagGroupFiles(): (string | MockFileDescriptor)[] {
  return [{ path: tagGroupsFilePath, textContent: JSON.stringify(tagGroups) }];
}
