import { describe, afterEach, it, expect } from 'vitest';
import { render, cleanup, screen } from '@minddrop/test-utils';
import { InvisibleTextField } from './InvisibleTextField';

describe('<InvisibleTextField />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    render(
      <InvisibleTextField
        placeholder="Untitled"
        label="Title"
        className="my-class"
      />,
    );

    expect(screen.getByRole('textbox').className).toContain('my-class');
  });

  it('renders the accessibility label', () => {
    render(<InvisibleTextField placeholder="Untitled" label="Title" />);

    expect(
      screen.getByRole('textbox').attributes.getNamedItem('aria-label')
        ?.textContent,
    ).toBe('Title');
  });

  it('supports sizes', () => {
    render(
      <InvisibleTextField placeholder="Untitled" label="Title" size="title" />,
    );

    expect(screen.getByRole('textbox').className).toContain('size-title');
  });

  it('supports colors', () => {
    render(
      <InvisibleTextField placeholder="Untitled" label="Title" color="light" />,
    );

    expect(screen.getByRole('textbox').className).toContain('color-light');
  });

  it('supports weights', () => {
    render(
      <InvisibleTextField
        placeholder="Untitled"
        label="Title"
        weight="semibold"
      />,
    );

    expect(screen.getByRole('textbox').className).toContain('weight-semibold');
  });
});
