import { BaseDirectory, MockFileDescriptor } from '@minddrop/file-system';
import { DatabasesConfigFileName } from '../constants';
import { ObjectDataType } from '../data-type-configs';
import { Database } from '../types';
import { databaseConfigFilePath } from '../utils';

export const parentDir = 'path/to/databases';

export const objectDatabase: Database = {
  name: 'Objects',
  entryName: 'Object',
  dataType: ObjectDataType.type,
  icon: 'content-icon:shapes:blue',
  path: `${parentDir}/Objects`,
  created: new Date('2024-01-01T00:00:00.000Z'),
  properties: [
    {
      type: 'text-formatted',
      name: 'Content',
      defaultValue: 'Default Content',
    },
    {
      type: 'icon',
      name: 'Icon',
    },
  ],
};

export const databases = [objectDatabase];

// File descriptors

export const databaseFiles: (MockFileDescriptor | string)[] = [
  parentDir,
  // User's databases config file
  {
    path: `${BaseDirectory.AppConfig}/${DatabasesConfigFileName}`,
    textContent: JSON.stringify(
      {
        paths: databases.map((db) => ({ name: db.name, path: db.path })),
      },
      null,
      2,
    ),
  },
  // Individual database config files
  {
    path: databaseConfigFilePath(objectDatabase.path),
    textContent: JSON.stringify(objectDatabase, null, 2),
  },
];
