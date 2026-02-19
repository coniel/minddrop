import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup } from '../test-utils';
import { downloadPropertyFile } from './downloadPropertyFile';

describe('downloadPropertyFile', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('does something useful', () => {
    expect(1).toBe(1);
  });
});
