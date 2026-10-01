import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setDatabaseContentDefault } from '../../setDatabaseContentDefault';
import { DatabaseFixtures, cleanup, setup } from '../../test-utils';
import { resolveDefaultDatabaseIdForText } from './resolveDefaultDatabaseIdForText';

const { objectDatabase, urlDatabase } = DatabaseFixtures;

describe('resolveDefaultDatabaseIdForText', () => {
  beforeEach(() => {
    setup();

    // Set the text default
    setDatabaseContentDefault('text', objectDatabase.id);
  });

  afterEach(cleanup);

  it('returns the text default', () => {
    expect(resolveDefaultDatabaseIdForText()).toBe(objectDatabase.id);
  });

  it('returns null when no text default is set', () => {
    setDatabaseContentDefault('text', null);

    expect(resolveDefaultDatabaseIdForText()).toBeNull();
  });

  it('prefers a target database with a content property over the text default', () => {
    setDatabaseContentDefault('text', urlDatabase.id);

    expect(resolveDefaultDatabaseIdForText(objectDatabase.id)).toBe(
      objectDatabase.id,
    );
  });

  it('ignores a target database with no content property', () => {
    expect(resolveDefaultDatabaseIdForText(urlDatabase.id)).toBe(
      objectDatabase.id,
    );
  });

  it('ignores a target database which does not exist', () => {
    expect(resolveDefaultDatabaseIdForText('missing-database')).toBe(
      objectDatabase.id,
    );
  });
});
