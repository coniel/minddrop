import { describe, expect, it } from 'vitest';
import { PropertySchema } from '@minddrop/properties';
import { PropertyFilterDraft } from '../../types';
import { resolveFilterProperty } from './resolveFilterProperty';

const title: PropertySchema = { type: 'title', name: 'Titel' };
const status: PropertySchema = {
  type: 'select',
  name: 'Status',
  options: [],
};
const properties = [title, status];

describe('resolveFilterProperty', () => {
  it('matches metadata properties by type regardless of name', () => {
    const filter: PropertyFilterDraft = {
      property: 'Title',
      propertyType: 'title',
      operator: 'contains',
    };

    expect(resolveFilterProperty(filter, properties)).toBe(title);
  });

  it('matches other properties by name', () => {
    const filter: PropertyFilterDraft = {
      property: 'Status',
      propertyType: 'select',
      operator: 'is',
    };

    expect(resolveFilterProperty(filter, properties)).toBe(status);
  });

  it('returns undefined for a property not among the given ones', () => {
    const filter: PropertyFilterDraft = {
      property: 'Priority',
      propertyType: 'number',
      operator: 'equals',
    };

    expect(resolveFilterProperty(filter, properties)).toBeUndefined();
  });
});
