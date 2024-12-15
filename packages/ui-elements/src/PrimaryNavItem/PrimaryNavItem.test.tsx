import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@minddrop/test-utils';
import { PrimaryNavItem } from './PrimaryNavItem';

describe('<PrimaryNavItem />', () => {
  afterEach(cleanup);

  it('renders the label', () => {
    render(<PrimaryNavItem label="Search" />);

    screen.getByText('Search');
  });

  it('renders the icon', () => {
    render(<PrimaryNavItem label="Search" icon="search" />);

    screen.getByTestId('icon');
  });

  it('is clickable', () => {
    const onClick = vi.fn();
    render(<PrimaryNavItem label="Search" onClick={onClick} />);

    act(() => {
      fireEvent.click(screen.getByRole('button'));
    });

    expect(onClick).toHaveBeenCalled();
  });

  it('is keyboard accessible', () => {
    const onClick = vi.fn();
    render(<PrimaryNavItem label="Search" onClick={onClick} />);

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
