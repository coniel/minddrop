import React from 'react';
import { render, cleanup, screen, act, fireEvent } from '@minddrop/test-utils';
import { SecondaryNavItem } from './SecondaryNavItem';

describe('<SecondaryNavItem />', () => {
  afterEach(cleanup);

  it('renders the label', () => {
    render(<SecondaryNavItem label="Search" icon="I" />);

    screen.getByText('Search');
  });

  it('renders the icon', () => {
    render(<SecondaryNavItem label="Search" icon="I" />);

    screen.getByText('I');
  });

  it('is clickable', () => {
    const onClick = jest.fn();
    render(<SecondaryNavItem label="Search" icon="I" onClick={onClick} />);

    act(() => {
      fireEvent.click(screen.getByRole('button'));
    });

    expect(onClick).toHaveBeenCalled();
  });

  it('is keyboard accessible', () => {
    const onClick = jest.fn();
    render(<SecondaryNavItem label="Search" icon="I" onClick={onClick} />);

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
