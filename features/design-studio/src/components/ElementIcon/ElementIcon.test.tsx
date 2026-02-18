import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@minddrop/test-utils';
import { cleanup, flatUsedPropertyElement, setup } from '../../test-utils';
import { ElementIcon } from './ElementIcon';

describe('<ElementIcon />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('renders the property icon for property elements', () => {
    render(<ElementIcon element={flatUsedPropertyElement} />);

    expect(screen.getByTestId('content-icon')).toHaveAttribute(
      'name',
      'shapes',
    );
  });
});
