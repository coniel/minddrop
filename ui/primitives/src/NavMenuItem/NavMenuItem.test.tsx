import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@minddrop/test-utils';
import { NavMenuItem } from './NavMenuItem';

describe('<NavMenuItem />', () => {
  afterEach(cleanup);

  it('renders the label', () => {
    render(<NavMenuItem label="Search" />);

    screen.getByText('Search');
  });

  it('renders the icon', () => {
    render(<NavMenuItem label="Search" icon="search" />);

    screen.getByTestId('icon');
  });

  it('is clickable', () => {
    const onClick = vi.fn();
    render(<NavMenuItem label="Search" onClick={onClick} />);

    act(() => {
      fireEvent.click(screen.getByRole('button'));
    });

    expect(onClick).toHaveBeenCalled();
  });

  it('is keyboard accessible', () => {
    const onClick = vi.fn();
    render(<NavMenuItem label="Search" onClick={onClick} />);

    act(() => {
      fireEvent.keyDown(screen.getByRole('button'), {
        key: 'Enter',
      });

      fireEvent.keyDown(screen.getByRole('button'), {
        key: ' ',
      });
    });

    expect(onClick).toHaveBeenCalledTimes(2);
  });
});
