import { describe, expect, it } from 'vitest';
import { PropertiesSchema } from '@minddrop/properties';
import { DesignElementFixtures } from '../../test-utils';
import { hasMappedPropertyType } from './hasMappedPropertyType';

const { bodyDesignElement, titleDesignElement } = DesignElementFixtures;

const properties: PropertiesSchema = [
  { type: 'title', name: 'Title' },
  { type: 'content', name: 'Content' },
];

describe('hasMappedPropertyType', () => {
  it('finds an element mapped to a property of the type', () => {
    expect(
      hasMappedPropertyType(
        [
          { ...titleDesignElement, property: 'Title' },
          { ...bodyDesignElement, property: 'Content' },
        ],
        properties,
        'content',
      ),
    ).toBe(true);
  });

  it('ignores elements mapped to properties of other types', () => {
    expect(
      hasMappedPropertyType(
        [{ ...titleDesignElement, property: 'Title' }],
        properties,
        'content',
      ),
    ).toBe(false);
  });

  it('ignores unmapped elements', () => {
    expect(
      hasMappedPropertyType(
        [{ ...bodyDesignElement, property: undefined }],
        properties,
        'content',
      ),
    ).toBe(false);
  });
});
