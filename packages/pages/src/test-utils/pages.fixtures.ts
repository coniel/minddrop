import { Design, DesignFixtures, Layout } from '@minddrop/designs';
import { MockFileDescriptor } from '@minddrop/file-system';
import { Page } from '../types';
import { getPageFilePath, getPagesDirPath } from '../utils';

const {
  design_books,
  element_text_1,
  layout_page_1,
  layout_page_2,
  layout_page_3,
} = DesignFixtures;

// A page layout containing a single element bound to the 'title' property
export const boundPageLayout: Layout = {
  ...layout_page_1,
  id: 'layout_page-bound',
  tree: {
    ...layout_page_1.tree,
    children: [{ ...element_text_1, property: 'title' }],
  },
};

// A design containing the bound page layout
export const pagesDesign: Design = {
  ...design_books,
  id: 'design_pages-fixtures',
  layouts: [boundPageLayout],
};

function generatePageFixture(number: number, layout: Layout): Page {
  return {
    id: `page_${number}`,
    name: `Page ${number}`,
    created: new Date('2024-01-01T00:00:00.000Z'),
    lastModified: new Date('2024-01-01T00:00:00.000Z'),
    layout: layout.id,
    properties: {},
  };
}

export const page_1 = generatePageFixture(1, layout_page_1);
export const page_2 = generatePageFixture(2, layout_page_2);
export const page_3 = generatePageFixture(3, layout_page_3);

export const pages = [page_1, page_2, page_3];

export const pageFiles: (string | MockFileDescriptor)[] = [
  getPagesDirPath(),
  ...pages.map((page) => ({
    path: getPageFilePath(page.id),
    textContent: JSON.stringify(page),
  })),
];
