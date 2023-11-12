---
to: packages/<%= package %>/src/components/<%= name %>/<%= name %>.test.tsx
---
import { describe, afterEach, it, expect } from 'vitest';
import { render, cleanup } from '@minddrop/test-utils';
import { <%= name %> } from './<%= name %>';

describe('<<%= name %> />', () => {
  afterEach(cleanup);

  it('renders', () => {
    render(<<%= name %> />);
  });
});
