import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, setup } from '../../test-utils';
import { resolveQueriesDirPath } from '../resolveQueriesDirPath';
import { resolveQueryId } from './resolveQueryId';

describe('resolveQueryId', () => {
  beforeEach(() => setup({}));

  afterEach(cleanup);

  it('returns the ID of a query file', () => {
    expect(resolveQueryId(`${resolveQueriesDirPath()}/query_1.json`)).toBe(
      'query_1',
    );
  });

  it('returns null for files which are not queries', () => {
    expect(resolveQueryId(`${resolveQueriesDirPath()}/notes.md`)).toBeNull();
  });

  it('returns null for files outside the queries directory', () => {
    expect(resolveQueryId('workspace/query_1.json')).toBeNull();
  });

  it('returns null for files nested below the queries directory', () => {
    expect(
      resolveQueryId(`${resolveQueriesDirPath()}/archive/query_1.json`),
    ).toBeNull();
  });
});
