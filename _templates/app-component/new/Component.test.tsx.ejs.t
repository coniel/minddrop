---
to: packages/minddrop/src/components/<%= name %>/<%= name %>.test.tsx
---
import React from 'react';
import { render, cleanup, screen } from '@minddrop/test-utils';
import { <%= name %> } from './<%= name %>';

describe('<<%= name %> />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    render(<<%= name %> className="my-class">content</<%= name %>>);

    expect(screen.getByText('content')).toHaveClass('my-class');
  });
});
