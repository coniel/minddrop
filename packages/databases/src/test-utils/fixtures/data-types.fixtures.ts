import { DataType } from '../../types';

export const dataTypeWithSerializer: DataType = {
  type: 'data-type-with-serializer',
  name: 'Data Type With Serializer',
  description: 'A data type with a custom serializer.',
  icon: 'content-icon:shapes:blue',
  properties: [
    {
      type: 'text',
      name: 'Title',
    },
    {
      type: 'icon',
      name: 'Icon',
    },
  ],
  file: false,
  serialize: (database, entry) => {
    return JSON.stringify({ properties: entry.properties, data: entry.data });
  },
  deserialize: (database, serializedEntry) => {
    const entry = JSON.parse(serializedEntry);

    return {
      properties: entry.properties,
      data: entry.data,
    };
  },
  fileExtension: 'json',
};

export const dataTypes = [dataTypeWithSerializer];
