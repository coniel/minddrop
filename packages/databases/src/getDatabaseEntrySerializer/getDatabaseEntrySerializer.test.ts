import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { markdownEntrySerializer } from '../entry-serializers';
import { DatabaseEntrySerializerNotRegisteredError } from '../errors';
import { cleanup, setup } from '../test-utils';
import { getDatabaseEntrySerializer } from './getDatabaseEntrySerializer';

describe('getDatabaseEntrySerializer', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the serializer if it exists', () => {
    const serializer = getDatabaseEntrySerializer('markdown');

    expect(serializer).toEqual(markdownEntrySerializer);
  });

  it('throws if the serializer does not exist', () => {
    expect(() => getDatabaseEntrySerializer('non-existent-serializer')).toThrow(
      DatabaseEntrySerializerNotRegisteredError,
    );
  });
});
