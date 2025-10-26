---
to: features/<%= location %>/src/<%= name %>/<%= name %>.test.tsx
---
import { describe, afterEach, it, expect } from 'vitest';
import { render, cleanup } from '@minddrop/test-utils';
import { <%= name %> } from './<%= name %>';

describe('<<%= name %> />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    const { getByText } = render(<<%= name %> className="my-class">content</<%= name %>>);

    expect(getByText('content')).toHaveClass('my-class');
  });
});
