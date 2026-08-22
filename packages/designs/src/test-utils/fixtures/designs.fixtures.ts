import { MockFileDescriptor } from '@minddrop/file-system';
import { PropertiesSchema } from '@minddrop/properties';
import {
  DatabaseDesign,
  Design,
  SpaceDesign,
  VirtualDesignData,
} from '../../types';
import {
  layout_card_1,
  layout_card_2,
  layout_card_3,
  layout_list_1,
  layout_list_2,
  layout_page_1,
  layout_page_2,
  layout_space_1,
} from './layouts.fixtures';

// A small properties schema for fixtures that need design properties
export const designProperties: PropertiesSchema = [
  { type: 'title', name: 'Title' },
  { type: 'text', name: 'Subtitle' },
  { type: 'text', name: 'Summary' },
  { type: 'image', name: 'Cover' },
];

export const design_books: DatabaseDesign = {
  id: 'design_books',
  type: 'database',
  name: 'Books',
  properties: designProperties,
  created: new Date(),
  lastModified: new Date(),
  layouts: [layout_card_1, layout_list_1, layout_page_1],
};

export const design_cards: DatabaseDesign = {
  id: 'design_cards',
  type: 'database',
  name: 'Cards',
  properties: [],
  created: new Date(),
  lastModified: new Date(),
  layouts: [layout_card_2, layout_card_3],
};

export const design_pages: DatabaseDesign = {
  id: 'design_pages',
  type: 'database',
  name: 'Pages',
  properties: [],
  created: new Date(),
  lastModified: new Date(),
  layouts: [layout_list_2, layout_page_2],
};

export const design_empty: DatabaseDesign = {
  id: 'design_empty',
  type: 'database',
  name: 'Empty',
  properties: [],
  created: new Date(),
  lastModified: new Date(),
  layouts: [],
};

// A virtual space design owned by a space entity
export const design_space_virtual: SpaceDesign = {
  id: 'design_space-1',
  type: 'space',
  name: 'Space',
  virtual: true,
  owner: 'space_owner-1',
  created: new Date(),
  lastModified: new Date(),
  layouts: [layout_space_1],
};

// The owner-persisted shape of the virtual space design
export const design_space_virtual_data: VirtualDesignData = {
  id: design_space_virtual.id,
  type: 'space',
  name: design_space_virtual.name,
  owner: 'space_owner-1',
  layouts: design_space_virtual.layouts,
};

// File-backed designs only; the virtual design has no bundle
export const designs: Design[] = [
  design_books,
  design_cards,
  design_pages,
  design_empty,
];

// Spelled out rather than resolved, so that the fixtures pin the paths
// down instead of agreeing with whatever the path utils produce
const designsDirPath = 'path/to/workspaces/Workspace 1/.minddrop/designs-next';

export function getDesignFiles(): MockFileDescriptor[] {
  return designs.map((design) => ({
    path: `${designsDirPath}/${design.id}/design.json`,
    textContent: JSON.stringify(design),
  }));
}
