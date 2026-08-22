import { Layout } from '@minddrop/designs-legacy';
import { MockFileDescriptor } from '@minddrop/file-system';
import { DefaultSpaceIcon } from '../constants';
import { Space } from '../types';
import { resolveSpaceFilePath, resolveSpacesDirPath } from '../utils';
import {
  spaceLayout_1,
  spaceLayout_2,
  spaceLayout_3,
} from './space-layouts.fixtures';

export * from './space-layouts.fixtures';

function generateSpaceFixture(number: number, layout: Layout): Space {
  return {
    id: `space_${number}`,
    name: `Space ${number}`,
    icon: DefaultSpaceIcon,
    created: new Date('2024-01-01T00:00:00.000Z'),
    lastModified: new Date('2024-01-01T00:00:00.000Z'),
    layout,
  };
}

export const space_1 = generateSpaceFixture(1, spaceLayout_1);
export const space_2 = generateSpaceFixture(2, spaceLayout_2);
export const space_3 = generateSpaceFixture(3, spaceLayout_3);

export const spaces = [space_1, space_2, space_3];

export function getSpaceFiles(): (string | MockFileDescriptor)[] {
  return [
    resolveSpacesDirPath(),
    ...spaces.map((space) => ({
      path: resolveSpaceFilePath(space.id),
      textContent: JSON.stringify(space),
    })),
  ];
}
