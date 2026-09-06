import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntryTemplateNotFoundError } from '../errors';
import { cleanup, entryTemplate1, setup } from '../test-utils';
import { getDatabaseEntryTemplate } from './getDatabaseEntryTemplate';

describe('getDatabaseEntryTemplate', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the requested template', () => {
    expect(getDatabaseEntryTemplate(entryTemplate1.id)).toEqual(entryTemplate1);
  });

  it('throws if the template does not exist', () => {
    expect(() => getDatabaseEntryTemplate('missing')).toThrow(
      DatabaseEntryTemplateNotFoundError,
    );
  });

  it('returns null if the template does not exist and throwOnNotFound is false', () => {
    expect(getDatabaseEntryTemplate('missing', false)).toBeNull();
  });
});
