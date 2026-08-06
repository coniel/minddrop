import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@minddrop/test-utils';
import { IconButton } from './IconButton';

describe('<IconButton />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    render(
      <IconButton stringLabel="icon" className="my-class">
        I
      </IconButton>,
    );

    expect(screen.getByRole('button').className).toContain('my-class');
  });

  it('renders children', () => {
    render(<IconButton stringLabel="icon">I</IconButton>);

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
      <IconButton stringLabel="contrast icon" color="contrast">
        I
      </IconButton>,
    );

    expect(screen.getByRole('button').className).toContain('color-contrast');
  });

  it('supports sizes', () => {
    render(
      <IconButton stringLabel="small icon" size="sm">
        I
      </IconButton>,
    );

    expect(screen.getByRole('button').className).toContain('size-sm');
  });

  it('can be disabled', () => {
    render(
      <IconButton disabled stringLabel="disabled">
        I
      </IconButton>,
    );

    expect(
      screen.getByRole('button').attributes.getNamedItem('disabled'),
    ).toBeTruthy();
  });

  it('supports custom components', () => {
    render(
      <IconButton as="span" stringLabel="span">
        I
      </IconButton>,
    );

    expect(screen.queryByRole('button')).toBe(null);
  });
});
