import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup } from '../test-utils';
import { useWorkspace } from './useWorkspace';

describe('useWorkspace', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('does something useful', () => {
    expect(1).toBe(1);
  });
});
