import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@minddrop/test-utils';
import { IconButton } from './IconButton';

describe('<IconButton />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    render(
      <IconButton label="icon" className="my-class">
        I
      </IconButton>,
    );

    expect(screen.getByRole('button').className).toContain('my-class');
  });


  it('renders children', () => {
    render(<IconButton label="icon">I</IconButton>);

    expect(screen.getByRole('button').textContent).toBe('I');
  });


  it('translates the label text', () => {
    const { getByTranslatedLabelText } = render(
      <IconButton label="test">I</IconButton>,
    );

    getByTranslatedLabelText('test');
  });

  it('supports colors', () => {
    render(
      <IconButton label="contrast icon" color="contrast">
        I
      </IconButton>,
    );

    expect(screen.getByRole('button').className).toContain('color-contrast');
  });

  it('supports sizes', () => {
    render(
      <IconButton label="small icon" size="sm">
        I
      </IconButton>,
    );

    expect(screen.getByRole('button').className).toContain('size-sm');
  });

  it('can be disabled', () => {
    render(
      <IconButton disabled label="disabled">
        I
      </IconButton>,
    );

    expect(
      screen.getByRole('button').attributes.getNamedItem('disabled'),
    ).toBeTruthy();
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
