import { describe, expect, it } from 'vitest';
import { itemsCollection } from '../../test-utils';
import { Collection } from '../../types';
import { CollectionPropertyType } from '../../types/CollectionPropertiesSchema.types';
import { generateDefaultCollectionEntryProperties } from './generateDefaultCollectionEntryProperties';

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
};

const dateFormat = new Intl.DateTimeFormat('en-GB', dateFormatOptions);

const collection: Collection = {
  ...itemsCollection,
  properties: [
    {
      name: 'Genre',
      type: CollectionPropertyType.Select,
      defaultValue: 'Fiction',
      options: [
        {
          value: 'Fiction',
          color: 'blue',
        },
      ],
    },
    {
      name: 'Created',
      type: CollectionPropertyType.Date,
      defaultValue: 'now',
      format: dateFormatOptions,
      locale: 'en-GB',
    },
    {
      name: 'Date',
      type: CollectionPropertyType.Date,
      defaultValue: new Date('2023-01-01'),
      format: dateFormatOptions,
      locale: 'en-GB',
    },
  ],
};

describe('generateDefaultCollectionEntryProperties', () => {
  it('includes basic collection default properties', () => {
    const properties = generateDefaultCollectionEntryProperties(collection);

    expect(properties.Genre).toEqual('Fiction');
  });

  it('formats date properties', () => {
    const properties = generateDefaultCollectionEntryProperties(collection);

    expect(properties.Date).toEqual(dateFormat.format(new Date('2023-01-01')));
  });

  it('formats date properties with default value "now"', () => {
    const properties = generateDefaultCollectionEntryProperties(collection);

    expect(properties.Created).toEqual(dateFormat.format(new Date()));
  });
});
