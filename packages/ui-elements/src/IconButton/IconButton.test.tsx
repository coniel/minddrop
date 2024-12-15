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

  it('renders icons from icon set', () => {
    render(<IconButton icon="settings" label="icon" />);
    expect(screen.getByTestId('icon').parentElement).toBe(
      screen.getByRole('button'),
    );
  });

  it('renders children', () => {
    render(<IconButton label="icon">I</IconButton>);

    expect(screen.getByRole('button').textContent).toBe('I');
  });

  it('prioritizes icon over children', () => {
    render(
      <IconButton icon="settings" label="icon">
        children
      </IconButton>,
    );
    expect(screen.getByTestId('icon').parentElement).toBe(
      screen.getByRole('button'),
    );
    expect(screen.getByRole('button').textContent).not.toBe('children');
  });

  it('translates the label text', () => {
    const { getByTranslatedLabelText } = render(
      <IconButton label="test">I</IconButton>,
    );

    getByTranslatedLabelText('test');
  });

  it('supports colors', () => {
    render(
      <IconButton label="light icon" color="light">
        I
      </IconButton>,
    );

    expect(screen.getByRole('button').className).toContain('color-light');
  });

  it('supports sizes', () => {
    render(
      <IconButton label="small icon" size="small">
        I
      </IconButton>,
    );

    expect(screen.getByRole('button').className).toContain('size-small');
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
