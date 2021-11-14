import React from 'react';
import { render, cleanup, screen } from '@minddrop/test-utils';
import { IconButton } from './IconButton';

describe('<IconButton />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    render(
      <IconButton label="icon" className="my-class">
        I
      </IconButton>,
    );

    expect(screen.getByRole('button')).toHaveClass('my-class');
  });

  it('renders icons from icon set', () => {
    render(<IconButton icon="settings" label="icon" />);
    expect(screen.getByRole('button')).toContainElement(
      screen.getByTestId('icon'),
    );
  });

  it('renders children', () => {
    render(<IconButton label="icon">I</IconButton>);

    expect(screen.getByRole('button')).toHaveTextContent('I');
  });

  it('prioritizes icon over children', () => {
    render(
      <IconButton icon="settings" label="icon">
        children
      </IconButton>,
    );
    expect(screen.getByRole('button')).toContainElement(
      screen.getByTestId('icon'),
    );
    expect(screen.getByRole('button')).not.toHaveTextContent('children');
  });

  it('uses the label', () => {
    render(<IconButton label="label">I</IconButton>);

    expect(screen.getByRole('button')).toHaveAccessibleName('label');
  });

  it('supports colors', () => {
    render(
      <IconButton label="light icon" color="light">
        I
      </IconButton>,
    );

    expect(screen.getByRole('button')).toHaveClass('color-light');
  });

  it('supports sizes', () => {
    render(
      <IconButton label="small icon" size="small">
        I
      </IconButton>,
    );

    expect(screen.getByRole('button')).toHaveClass('size-small');
  });

  it('can be disabled', () => {
    render(
      <IconButton disabled label="disabled">
        I
      </IconButton>,
    );

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('supports custom components', () => {
    render(
      <IconButton as="span" label="span">
        I
      </IconButton>,
    );

    expect(screen.queryByRole('button')).toBe(null);
  });
});
