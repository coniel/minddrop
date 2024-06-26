---
to: <%= location %>/<%= package %>/src/<%= name %>/<%= name %>.test.ts
---
import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup } from '../test-utils';
import { <%= name %> } from './<%= name %>';

describe('<%= name %>', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('does something useful', () => {
    expect(1).toBe(1);
  });
});
