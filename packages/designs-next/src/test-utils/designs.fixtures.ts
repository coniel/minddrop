import { MockFileDescriptor } from '@minddrop/file-system';
import { Design } from '../types';
import {
  bodyDesignElement,
  coverDesignElement,
  designElement_besideIcon_1,
  designElement_besideIcon_2,
  designElement_besideIcon_3,
  designElement_besideText,
  designElement_heading,
  designElement_pinwheel_1,
  designElement_pinwheel_2,
  designElement_pinwheel_3,
  designElement_pinwheel_4,
  designElement_pinwheel_5,
  designElement_stackedBody,
  designElement_stackedFooter,
  designElement_stackedHeading,
  designElements,
  titleDesignElement,
} from './design-elements.fixtures';

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
  owner: 'owner_1',
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
  owner: 'owner_1',
};

// The unowned designs, each written to its own design file
export const designs = [cardDesign_1, pageDesign_1];

// The owned designs, which have no design files
export const ownedDesigns = [ownedCardDesign_1, ownedListDesign_1];

// A growing heading with two rows of gap above and below it
export const design_heading: Design = {
  id: 'design_heading',
  name: 'Heading',
  type: 'card',
  columns: 48,
  rows: 12,
  elements: [designElement_heading],
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
};

// A heading, a growing body, a gap and a fixed footer, all full width
export const design_stacked: Design = {
  id: 'design_stacked',
  name: 'Stacked',
  type: 'card',
  columns: 48,
  rows: 32,
  elements: [
    designElement_stackedHeading,
    designElement_stackedBody,
    designElement_stackedFooter,
  ],
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
};

// Three icons stacked in a column beside a growing text spanning
// all of their rows.
export const design_icons_beside_text: Design = {
  id: 'design_icons-beside-text',
  name: 'Icons beside text',
  type: 'card',
  columns: 48,
  rows: 22,
  elements: [
    designElement_besideIcon_1,
    designElement_besideIcon_2,
    designElement_besideIcon_3,
    designElement_besideText,
  ],
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
};

// A cover with a title layered over it, a gap and a growing body
export const design_cover_title: Design = {
  id: 'design_cover-title',
  name: 'Cover title',
  type: 'card',
  columns: 48,
  rows: 32,
  elements: [coverDesignElement, titleDesignElement, bodyDesignElement],
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
};

// Five elements in a pinwheel, which no line cuts in either direction
export const design_pinwheel: Design = {
  id: 'design_pinwheel',
  name: 'Pinwheel',
  type: 'card',
  columns: 48,
  rows: 32,
  elements: [
    designElement_pinwheel_1,
    designElement_pinwheel_2,
    designElement_pinwheel_3,
    designElement_pinwheel_4,
    designElement_pinwheel_5,
  ],
  created: new Date('2024-01-01T00:00:00.000Z'),
  lastModified: new Date('2024-01-01T00:00:00.000Z'),
};

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
