import React from 'react';
import { render, screen } from '@minddrop/test-utils';
import { Button } from './Button';

describe('Button', () => {
  it('should display the label', () => {
    render(<Button label="Hello" />);

    expect(screen.getByRole('button')).toHaveTextContent('Hello');
  });
});
