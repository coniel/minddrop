import { it } from 'vitest';
import { render } from '@testing-library/react';
import { Button } from './Button';

it('renders', () => {
  const { getByText } = render(<Button />);

  getByText('Boop');
});
