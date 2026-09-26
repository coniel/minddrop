import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Properties } from '@minddrop/properties';
import { DatabasesStore } from '../../DatabasesStore';
import { DatabaseNotFoundError } from '../../errors';
import { cleanup, objectDatabase, setup, urlDatabase } from '../../test-utils';
import { resolveDefaultPropertyOfType } from './resolveDefaultPropertyOfType';

// The object database's content property
const contentProperty = objectDatabase.properties.find(Properties.isContent)!;
// A second content property
const secondContentProperty = { ...contentProperty, name: 'Body' };

describe('resolveDefaultPropertyOfType', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the first property of the type', () => {
    // Add a second content property after the first
    DatabasesStore.update(objectDatabase.id, {
      ...objectDatabase,
      properties: [...objectDatabase.properties, secondContentProperty],
    });

    expect(resolveDefaultPropertyOfType(objectDatabase.id, 'content')).toEqual(
      contentProperty,
    );
  });

  it('returns the default property for the type when set', () => {
    // Add a second content property, set as the default
    DatabasesStore.update(objectDatabase.id, {
      ...objectDatabase,
      properties: [...objectDatabase.properties, secondContentProperty],
      defaultProperties: { content: secondContentProperty.name },
    });

    expect(resolveDefaultPropertyOfType(objectDatabase.id, 'content')).toEqual(
      secondContentProperty,
    );
  });

  it('falls back to the first property of the type when the default is missing', () => {
    // Set a default which names no property
    DatabasesStore.update(objectDatabase.id, {
      ...objectDatabase,
      defaultProperties: { content: 'Missing' },
    });

    expect(resolveDefaultPropertyOfType(objectDatabase.id, 'content')).toEqual(
      contentProperty,
    );
  });

  it('falls back to the first property of the type when the default is of another type', () => {
    // Set a default naming a property of another type
    DatabasesStore.update(objectDatabase.id, {
      ...objectDatabase,
      defaultProperties: { content: 'Icon' },
    });

    expect(resolveDefaultPropertyOfType(objectDatabase.id, 'content')).toEqual(
      contentProperty,
    );
  });

  it('returns null when the database has no property of the type', () => {
    expect(resolveDefaultPropertyOfType(urlDatabase.id, 'content')).toBeNull();
  });

  it('throws if the database does not exist', () => {
    expect(() => resolveDefaultPropertyOfType('missing', 'content')).toThrow(
      DatabaseNotFoundError,
    );
  });
});
