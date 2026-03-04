import { DefaultContainerElementStyle, RootElement } from '@minddrop/designs';
import { MockFileDescriptor } from '@minddrop/file-system';
import { Page } from '../types';
import { getPageFilePath, getPagesDirPath } from '../utils';

const emptyTree: RootElement = {
  id: 'root',
  type: 'root',
  style: DefaultContainerElementStyle,
  children: [],
};

function generatePageFixture(number: number): Page {
  return {
    id: `page-${number}`,
    name: `Page ${number}`,
    created: new Date('2024-01-01T00:00:00.000Z'),
    lastModified: new Date('2024-01-01T00:00:00.000Z'),
    tree: emptyTree,
  };
}

export const page_1 = generatePageFixture(1);
export const page_2 = generatePageFixture(2);
export const page_3 = generatePageFixture(3);

export const pages = [page_1, page_2, page_3];

export const pageFiles: (string | MockFileDescriptor)[] = [
  getPagesDirPath(),
  ...pages.map((page) => ({
    path: getPageFilePath(page.id),
    textContent: JSON.stringify(page),
  })),
];
