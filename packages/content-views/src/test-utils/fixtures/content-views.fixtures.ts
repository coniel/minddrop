import { Fs, MockFileDescriptor } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { ContentViewFileExtension, ContentViewsDirName } from '../../constants';
import { ContentView, ViewDataSource } from '../../types';

const { workspace_1 } = WorkspaceFixtures;

export const contentViewsRootPath = Fs.concatPath(
  workspace_1.path,
  Paths.hiddenDirName,
  ContentViewsDirName,
);

function generateViewFixture(
  type: string,
  dataSource: ViewDataSource,
  number: number,
): ContentView {
  return {
    id: `content-view_${type}_${number}`,
    name: `${type} ${number}`,
    type,
    icon: 'lucide:panels-top-left:default',
    dataSource,
    lastModified: new Date('2024-01-01T00:00:00.000Z'),
    created: new Date('2024-01-01T00:00:00.000Z'),
  };
}

export const contentView_gallery_1 = generateViewFixture(
  'gallery',
  {
    type: 'database',
    id: 'database-1',
  },
  1,
);
export const contentView_gallery_2 = generateViewFixture(
  'gallery',
  {
    type: 'database',
    id: 'database-2',
  },
  2,
);
export const contentView_gallery_3 = generateViewFixture(
  'gallery',
  {
    type: 'database',
    id: 'database-3',
  },
  3,
);

export const contentView_board_1 = generateViewFixture(
  'board',
  {
    type: 'database',
    id: 'database-1',
  },
  1,
);
export const contentView_board_2 = generateViewFixture(
  'board',
  {
    type: 'database',
    id: 'database-2',
  },
  2,
);
export const contentView_board_3 = generateViewFixture(
  'board',
  {
    type: 'database',
    id: 'database-3',
  },
  3,
);

export const contentView_table_1 = generateViewFixture(
  'table',
  {
    type: 'database',
    id: 'database-1',
  },
  1,
);

function generateVirtualViewFixture(
  type: string,
  dataSource: ViewDataSource,
  number: number,
): ContentView {
  return {
    ...generateViewFixture(type, dataSource, number),
    id: `content-view_virtual_${number}`,
    name: `virtual ${type} ${number}`,
    virtual: true,
  };
}

export const contentView_virtual_1 = generateVirtualViewFixture(
  'gallery',
  {
    type: 'database',
    id: 'database-1',
  },
  1,
);

export const contentViews = [
  contentView_gallery_1,
  contentView_gallery_2,
  contentView_gallery_3,
  contentView_board_1,
  contentView_board_2,
  contentView_board_3,
  contentView_table_1,
];

// All content views including virtual ones
export const allContentViews = [...contentViews, contentView_virtual_1];

export const contentViewFiles: MockFileDescriptor[] = contentViews.map(
  (view) => ({
    path: Fs.concatPath(
      contentViewsRootPath,
      Fs.addFileExtension(view.id, ContentViewFileExtension),
    ),
    textContent: JSON.stringify(view),
  }),
);
