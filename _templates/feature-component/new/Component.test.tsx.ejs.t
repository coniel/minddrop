---
to: features/<%= location %>/src/<%= name %>/<%= name %>.test.tsx
---
import { describe, afterEach, it, expect } from 'vitest';
import { cleanup, render, screen } from '@minddrop/test-utils';
import { <%= name %> } from './<%= name %>';

describe('<<%= name %> />', () => {
  afterEach(cleanup);

  it('renders', () => {
    render(<<%= name %> foo="bar" />);

    screen.getByText('bar');
  });
});
