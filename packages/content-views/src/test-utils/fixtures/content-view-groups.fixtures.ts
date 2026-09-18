import { EntityGroup, EntityGroupId } from '@minddrop/entity-groups';
import { MockFileDescriptor } from '@minddrop/file-system';
import { ContentViewGroupsType } from '../../constants';

// The date every fixture group was created and last changed
const fixtureDate = new Date('2024-01-01T00:00:00.000Z');

export const contentViewGroup_1: EntityGroup = {
  id: 'entity-group_content-view-group-1' as EntityGroupId,
  type: ContentViewGroupsType,
  name: 'Content view group 1',
  items: [],
  created: fixtureDate,
  lastModified: fixtureDate,
};

export const contentViewGroup_2: EntityGroup = {
  id: 'entity-group_content-view-group-2' as EntityGroupId,
  type: ContentViewGroupsType,
  name: 'Content view group 2',
  items: [],
  created: fixtureDate,
  lastModified: fixtureDate,
};

export const contentViewGroups = [contentViewGroup_1, contentViewGroup_2];

// Spelled out rather than resolved, so that the fixtures pin the path
// down instead of agreeing with whatever the path utils produce.
const contentViewGroupsFilePath =
  'path/to/workspaces/Workspace 1/.minddrop/entity-groups/content-view-groups.json';

export const contentViewGroupFiles: MockFileDescriptor[] = [
  {
    path: contentViewGroupsFilePath,
    textContent: JSON.stringify(contentViewGroups),
  },
];
