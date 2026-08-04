import { MockFileDescriptor } from '@minddrop/file-system';
import { PropertiesSchema } from '@minddrop/properties';
import { Design } from '../../types';
import { getDesignFilePath } from '../../utils';
import {
  layout_card_1,
  layout_card_2,
  layout_card_3,
  layout_list_1,
  layout_list_2,
  layout_list_3,
  layout_page_1,
  layout_page_2,
  layout_page_3,
} from './layouts.fixtures';

export const designsRootPath = 'path/to/Designs';

// A small properties schema for fixtures that need design properties
export const designProperties: PropertiesSchema = [
  { type: 'text', name: 'Title' },
  { type: 'text', name: 'Subtitle' },
];

export const design_books: Design = {
  id: 'design_books',
  name: 'Books',
  properties: designProperties,
  created: new Date(),
  lastModified: new Date(),
  layouts: [layout_card_1, layout_list_1, layout_page_1],
};

export const design_cards: Design = {
  id: 'design_cards',
  name: 'Cards',
  properties: [],
  created: new Date(),
  lastModified: new Date(),
  layouts: [layout_card_2, layout_card_3],
};

export const design_lists: Design = {
  id: 'design_lists',
  name: 'Lists',
  properties: [],
  created: new Date(),
  lastModified: new Date(),
  layouts: [layout_list_2, layout_list_3],
};

export const design_pages: Design = {
  id: 'design_pages',
  name: 'Pages',
  properties: [],
  created: new Date(),
  lastModified: new Date(),
  layouts: [layout_page_2, layout_page_3],
};

export const design_empty: Design = {
  id: 'design_empty',
  name: 'Empty',
  properties: [],
  created: new Date(),
  lastModified: new Date(),
  layouts: [],
};

export const designs = [
  design_books,
  design_cards,
  design_lists,
  design_pages,
  design_empty,
];

export const designFiles: MockFileDescriptor[] = designs.map((design) => ({
  path: getDesignFilePath(design.id),
  textContent: JSON.stringify(design),
}));
