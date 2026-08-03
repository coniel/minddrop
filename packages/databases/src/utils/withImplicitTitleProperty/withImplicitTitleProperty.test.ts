import { describe, expect, it } from 'vitest';
import { initializeI18n } from '@minddrop/i18n';
import { PropertiesSchema } from '@minddrop/properties';
import { objectDatabase } from '../../test-utils';
import { withImplicitTitleProperty } from './withImplicitTitleProperty';

// Initialize translations used for the implicit property name
initializeI18n();

describe('withImplicitTitleProperty', () => {
  it('prepends the implicit Title property', () => {
    const properties = withImplicitTitleProperty(objectDatabase.properties);

    expect(properties[0]).toEqual({ type: 'title', name: 'Title' });
    expect(properties.slice(1)).toEqual(objectDatabase.properties);
  });

  it('leaves schemas with a declared title property untouched', () => {
    // A schema which already declares a title property
    const declaredTitleSchema: PropertiesSchema = [
      { type: 'title', name: 'Name' },
      ...objectDatabase.properties,
    ];

    expect(withImplicitTitleProperty(declaredTitleSchema)).toBe(
      declaredTitleSchema,
    );
  });
});
