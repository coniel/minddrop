import { Fs, MockFileDescriptor } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { WorkspaceFixtures } from '@minddrop/workspaces';
import { ViewFileExtension, ViewsDirName } from '../../constants';
import { DataView, ViewDataSource } from '../../types';

const { workspace_1 } = WorkspaceFixtures;

export const dataViewsRootPath = Fs.concatPath(
  workspace_1.path,
  Paths.hiddenDirName,
  ViewsDirName,
);

function generateViewFixture(
  type: string,
  dataSource: ViewDataSource,
  number: number,
): DataView {
  return {
    id: `data-view_${type}-${number}`,
    name: `${type} ${number}`,
    type,
    icon: 'content-icon:layout:default',
    dataSource,
    lastModified: new Date('2024-01-01T00:00:00.000Z'),
    created: new Date('2024-01-01T00:00:00.000Z'),
  };
}

export const dataView_gallery_1 = generateViewFixture(
  'gallery',
  {
    type: 'database',
    id: 'database-1',
  },
  1,
);
export const dataView_gallery_2 = generateViewFixture(
  'gallery',
  {
    type: 'database',
    id: 'database-2',
  },
  2,
);
export const dataView_gallery_3 = generateViewFixture(
  'gallery',
  {
    type: 'database',
    id: 'database-3',
  },
  3,
);

export const dataView_board_1 = generateViewFixture(
  'board',
  {
    type: 'database',
    id: 'database-1',
  },
  1,
);
export const dataView_board_2 = generateViewFixture(
  'board',
  {
    type: 'database',
    id: 'database-2',
  },
  2,
);
export const dataView_board_3 = generateViewFixture(
  'board',
  {
    type: 'database',
    id: 'database-3',
  },
  3,
);

function generateVirtualViewFixture(
  type: string,
  dataSource: ViewDataSource,
  number: number,
): DataView {
  return {
    ...generateViewFixture(type, dataSource, number),
    id: `data-view_virtual-${type}-${number}`,
    name: `virtual ${type} ${number}`,
    virtual: true,
  };
}

export const dataView_virtual_1 = generateVirtualViewFixture(
  'gallery',
  {
    type: 'database',
    id: 'database-1',
  },
  1,
);

export const dataViews = [
  dataView_gallery_1,
  dataView_gallery_2,
  dataView_gallery_3,
  dataView_board_1,
  dataView_board_2,
  dataView_board_3,
];

// All data views including virtual ones
export const allDataViews = [...dataViews, dataView_virtual_1];

export const dataViewFiles: MockFileDescriptor[] = dataViews.map((view) => ({
  path: Fs.concatPath(
    dataViewsRootPath,
    Fs.addFileExtension(view.id, ViewFileExtension),
  ),
  textContent: JSON.stringify(view),
}));
