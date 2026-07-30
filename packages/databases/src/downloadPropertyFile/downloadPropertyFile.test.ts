import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, setup } from '../test-utils';
import { downloadPropertyFile } from './downloadPropertyFile';

describe('downloadPropertyFile', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('does something useful', () => {
    expect(1).toBe(1);
  });
});
