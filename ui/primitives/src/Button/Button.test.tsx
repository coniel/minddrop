import { afterEach, describe, expect, it } from 'vitest';
import { i18n } from '@minddrop/i18n';
import { act, cleanup, render, screen } from '@minddrop/test-utils';
import { Button } from './Button';

describe('Button', () => {
  afterEach(cleanup);

  it('displays the i18n label', () => {
    render(<Button label="test" />);

    expect(screen.getByRole('button').textContent).toBe('Test-en-GB');

    act(() => {
      i18n.changeLanguage('fr-FR');
    });

    expect(screen.getByRole('button').textContent).toBe('Test-fr-FR');

    act(() => {
      i18n.changeLanguage('en-GB');
    });
  });

  it('renders children', () => {
    render(<Button>test</Button>);

    expect(screen.getByRole('button').textContent).toBe('test');
  });

  it('does not render children if label is present', () => {
    render(<Button label="test">hello</Button>);

    expect(screen.getByRole('button').textContent).not.toBe('hello');
  });

  it('supports variants', () => {
    render(<Button variant="primary" />);

    expect(screen.getByRole('button').className).toContain('variant-primary');
  });

  it('supports sizes', () => {
    render(<Button size="small" />);

    expect(screen.getByRole('button').className).toContain('size-small');
  });

  it('can be disabled', () => {
    render(<Button disabled />);

    expect(
      screen.getByRole('button').attributes.getNamedItem('disabled'),
    ).toBeTruthy();
  });

  it('can be full width', () => {
    render(<Button fullWidth />);

    expect(screen.getByRole('button').className).toContain('full-width');
  });

  it('renders as an anchor element when href prop is present', () => {
    render(<Button href="https://minddrop.app">MindDrop</Button>);

    expect(screen.getByRole('link').textContent).toBe('MindDrop');
  });

  it('renders endIcon', () => {
    render(<Button endIcon="settings" />);

    screen.getByTestId('icon');
  });

  it('renders startIcon', () => {
    render(<Button startIcon="settings" />);

    screen.getByTestId('icon');
  });
});
