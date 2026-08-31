import { MockFileDescriptor } from '@minddrop/file-system';
import { TagGroup, TagGroupId } from '../types';

function generateTagGroupFixture(number: number): TagGroup {
  return {
    id: `tag-group_${number}` as TagGroupId,
    name: `Group ${number}`,
    created: new Date('2024-01-01T00:00:00.000Z'),
    lastModified: new Date('2024-01-01T00:00:00.000Z'),
  };
}

export const tagGroup_1 = generateTagGroupFixture(1);
export const tagGroup_2 = generateTagGroupFixture(2);

export const tagGroups = [tagGroup_1, tagGroup_2];

// Spelled out rather than resolved, so that the fixtures pin the paths
// down instead of agreeing with whatever the path utils produce
const tagGroupsDirPath = 'path/to/workspaces/Workspace 1/.minddrop/tag-groups';

export function getTagGroupFiles(): (string | MockFileDescriptor)[] {
  return [
    tagGroupsDirPath,
    ...tagGroups.map((group) => ({
      path: `${tagGroupsDirPath}/${group.id}.json`,
      textContent: JSON.stringify(group),
    })),
  ];
}
