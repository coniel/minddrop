import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, setup } from '../test-utils';
import { updateDatabaseEntryProperty } from './updateDatabaseEntryProperty';

describe('updateDatabaseEntryProperty', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('does something useful', () => {
    expect(1).toBe(1);
  });
});
