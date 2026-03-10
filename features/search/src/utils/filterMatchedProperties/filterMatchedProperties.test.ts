import { describe, expect, it } from 'vitest';
import type { FullTextMatchedProperty } from '@minddrop/search';
import { filterMatchedProperties } from './filterMatchedProperties';

const textProperty: FullTextMatchedProperty = {
  name: 'Author',
  type: 'text',
  value: 'Stephen King',
};

const imageProperty: FullTextMatchedProperty = {
  name: 'Cover',
  type: 'image',
  value: 'cover.jpg',
};

describe('filterMatchedProperties', () => {
  it('returns all properties when none are images', () => {
    const result = filterMatchedProperties([textProperty]);

    expect(result).toEqual([textProperty]);
  });

  it('filters out image properties when non-image matches exist', () => {
    const result = filterMatchedProperties([textProperty, imageProperty]);

    expect(result).toEqual([textProperty]);
  });

  it('returns image properties when they are the only matches', () => {
    const result = filterMatchedProperties([imageProperty]);

    expect(result).toEqual([imageProperty]);
  });

  it('returns an empty array when given an empty array', () => {
    const result = filterMatchedProperties([]);

    expect(result).toEqual([]);
  });
});
