import { Fs, MockFileDescriptor } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { ViewFileExtension, ViewsDirName } from '../../constants';
import { View, ViewDataSource } from '../../types';

export const viewsRootPath = `workspace/${Paths.hiddenDirName}/${ViewsDirName}`;

function generateViewFixture(
  type: string,
  dataSource: ViewDataSource,
  number: number,
): View {
  return {
    id: `view-${type}-${number}`,
    name: `${type} ${number}`,
    type,
    dataSource,
    lastModified: new Date('2024-01-01T00:00:00.000Z'),
    created: new Date('2024-01-01T00:00:00.000Z'),
    databaseDesignMap: {
      [dataSource.id]: 'design-1',
    },
  };
}

export const view_gallery_1 = generateViewFixture(
  'gallery',
  {
    type: 'database',
    id: 'database-1',
  },
  1,
);
export const view_gallery_2 = generateViewFixture(
  'gallery',
  {
    type: 'database',
    id: 'database-2',
  },
  2,
);
export const view_gallery_3 = generateViewFixture(
  'gallery',
  {
    type: 'database',
    id: 'database-3',
  },
  3,
);

export const view_board_1 = generateViewFixture(
  'board',
  {
    type: 'database',
    id: 'database-1',
  },
  1,
);
export const view_board_2 = generateViewFixture(
  'board',
  {
    type: 'database',
    id: 'database-2',
  },
  2,
);
export const view_board_3 = generateViewFixture(
  'board',
  {
    type: 'database',
    id: 'database-3',
  },
  3,
);

export const views = [
  view_gallery_1,
  view_gallery_2,
  view_gallery_3,
  view_board_1,
  view_board_2,
  view_board_3,
];

export const viewFiles: MockFileDescriptor[] = views.map((view) => ({
  path: Fs.concatPath(
    viewsRootPath,
    Fs.addFileExtension(view.id, ViewFileExtension),
  ),
  textContent: JSON.stringify(view),
}));
