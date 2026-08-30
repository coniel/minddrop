import { MockFileDescriptor } from '@minddrop/file-system';
import { ContentColor } from '@minddrop/ui-theme';
import { Tag, TagId } from '../types';

function generateTagFixture(number: number, color: ContentColor): Tag {
  return {
    id: `tag_${number}` as TagId,
    name: `Tag ${number}`,
    color,
    created: new Date('2024-01-01T00:00:00.000Z'),
    lastModified: new Date('2024-01-01T00:00:00.000Z'),
  };
}

export const tag_1 = generateTagFixture(1, 'blue');
export const tag_2 = generateTagFixture(2, 'red');
export const tag_3 = generateTagFixture(3, 'green');

export const tags = [tag_1, tag_2, tag_3];

// Spelled out rather than resolved, so that the fixtures pin the paths
// down instead of agreeing with whatever the path utils produce
const tagsDirPath = 'path/to/workspaces/Workspace 1/.minddrop/tags';

export function getTagFiles(): (string | MockFileDescriptor)[] {
  return [
    tagsDirPath,
    ...tags.map((tag) => ({
      path: `${tagsDirPath}/${tag.id}.json`,
      textContent: JSON.stringify(tag),
    })),
  ];
}
