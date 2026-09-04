import { MockFileDescriptor } from '@minddrop/file-system';
import { Design } from '../types';
import { designElements } from './design-elements.fixtures';

export const cardDesign_1: Design = {
  id: 'design_1',
  name: 'Card design 1',
  type: 'card',
  columns: 48,
  rows: 32,
  elements: designElements,
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
};

export const pageDesign_1: Design = {
  id: 'design_2',
  name: 'Page design 1',
  type: 'page',
  columns: 48,
  rows: 32,
  elements: [],
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
};

export const ownedCardDesign_1: Design = {
  id: 'design_3',
  name: 'Owned card design 1',
  type: 'card',
  columns: 48,
  rows: 32,
  elements: [],
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
  owner: 'database_1',
};

export const ownedListDesign_1: Design = {
  id: 'design_4',
  name: 'Owned list design 1',
  type: 'list',
  columns: 48,
  rows: 32,
  elements: [],
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
  owner: 'database_1',
};

// The unowned designs, each written to its own design file
export const designs = [cardDesign_1, pageDesign_1];

// The owned designs, which have no design files
export const ownedDesigns = [ownedCardDesign_1, ownedListDesign_1];

// Spelled out rather than resolved, so that the fixtures pin the paths
// down instead of agreeing with whatever the path utils produce.
const designsDirPath = 'path/to/workspaces/Workspace 1/.minddrop/designs-next';

export function getDesignFiles(): (string | MockFileDescriptor)[] {
  return [
    designsDirPath,
    ...designs.map((design) => ({
      path: `${designsDirPath}/${design.id}.json`,
      textContent: JSON.stringify(design),
    })),
  ];
}
