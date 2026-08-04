import { Layout } from '@minddrop/designs';
import { MockFileDescriptor } from '@minddrop/file-system';
import { DefaultPageIcon } from '../constants';
import { Page } from '../types';
import { getPageFilePath, getPagesDirPath } from '../utils';
import {
  pageLayout_1,
  pageLayout_2,
  pageLayout_3,
} from './page-layouts.fixtures';

export * from './page-layouts.fixtures';

function generatePageFixture(number: number, layout: Layout): Page {
  return {
    id: `page_${number}`,
    name: `Page ${number}`,
    icon: DefaultPageIcon,
    created: new Date('2024-01-01T00:00:00.000Z'),
    lastModified: new Date('2024-01-01T00:00:00.000Z'),
    layout,
    properties: {},
  };
}

export const page_1 = generatePageFixture(1, pageLayout_1);
export const page_2 = generatePageFixture(2, pageLayout_2);
export const page_3 = generatePageFixture(3, pageLayout_3);

export const pages = [page_1, page_2, page_3];

export const pageFiles: (string | MockFileDescriptor)[] = [
  getPagesDirPath(),
  ...pages.map((page) => ({
    path: getPageFilePath(page.id),
    textContent: JSON.stringify(page),
  })),
];
