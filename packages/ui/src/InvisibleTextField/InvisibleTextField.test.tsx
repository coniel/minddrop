import React from 'react';
import { render, cleanup, screen } from '@minddrop/test-utils';
import { InvisibleTextField } from './InvisibleTextField';

describe('<InvisibleTextField />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    render(<InvisibleTextField label="Title" className="my-class" />);

    expect(screen.getByRole('textbox')).toHaveClass('my-class');
  });

  it('renders the accessability label', () => {
    render(<InvisibleTextField label="Title" />);

    expect(screen.getByRole('textbox')).toHaveAccessibleName('Title');
  });

  it('supports sizes', () => {
    render(<InvisibleTextField label="Title" size="title" />);

    expect(screen.getByRole('textbox')).toHaveClass('size-title');
  });

  it('supports colors', () => {
    render(<InvisibleTextField label="Title" color="light" />);

    expect(screen.getByRole('textbox')).toHaveClass('color-light');
  });

  it('supports weights', () => {
    render(<InvisibleTextField label="Title" weight="semibold" />);

    expect(screen.getByRole('textbox')).toHaveClass('weight-semibold');
  });
});
