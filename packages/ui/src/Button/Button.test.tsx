import React from 'react';
import { render, cleanup, act, screen } from '@minddrop/test-utils';
import { i18n } from '@minddrop/i18n';
import { Button } from './Button';

describe('Button', () => {
  afterEach(cleanup);

  it('displays the i18n label', () => {
    render(<Button label="test" />);

    expect(screen.getByRole('button')).toHaveTextContent('Test-en-GB');

    act(() => {
      i18n.changeLanguage('fr-FR');
    });

    expect(screen.getByRole('button')).toHaveTextContent('Test-fr-FR');

    act(() => {
      i18n.changeLanguage('en-GB');
    });
  });

  it('renders children', () => {
    render(<Button>test</Button>);

    expect(screen.getByRole('button')).toHaveTextContent('test');
  });

  it('does not render children if label is present', () => {
    render(<Button label="test">hello</Button>);

    expect(screen.getByRole('button')).not.toHaveTextContent('hello');
  });

  it('supports variants', () => {
    render(<Button variant="primary" />);

    expect(screen.getByRole('button')).toHaveClass('variant-primary');
  });

  it('supports sizes', () => {
    render(<Button size="small" />);

    expect(screen.getByRole('button')).toHaveClass('size-small');
  });

  it('can be disabled', () => {
    render(<Button disabled />);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('can be full width', () => {
    render(<Button fullWidth />);

    expect(screen.getByRole('button')).toHaveClass('full-width');
  });

  it('renders as an anchor element when href prop is present', () => {
    render(<Button href="https://minddrop.app">MindDrop</Button>);

    expect(screen.getByRole('link')).toHaveTextContent('MindDrop');
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
