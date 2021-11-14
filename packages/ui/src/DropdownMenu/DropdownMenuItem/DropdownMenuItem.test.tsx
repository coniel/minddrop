/* eslint-disable class-methods-use-this */
import React from 'react';
import {
  render,
  cleanup,
  screen,
  act,
  fireEvent,
  waitFor,
} from '@minddrop/test-utils';
import { DropdownMenu } from '../DropdownMenu';
import { DropdownMenuContent } from '../DropdownMenuContent';
import { DropdownMenuItem } from './DropdownMenuItem';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';

class ResizeObserver {
  observe() {}

  unobserve() {}
}

describe('<DropdownMenuItem />', () => {
  afterEach(cleanup);

  beforeAll(() => {
    // @ts-ignore
    window.DOMRect = { fromRect: () => ({}) };
    // @ts-ignore
    window.ResizeObserver = ResizeObserver;
  });

  it('renders tooltip title and description', async () => {
    render(
      <DropdownMenu open onOpenChange={() => null}>
        <DropdownMenuTrigger>
          <div data-testid="target" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            label="item"
            onSelect={jest.fn()}
            tooltipTitle="Tooltip title"
            tooltipDescription="Tooltip description"
          />
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await waitFor(() => screen.getByText('item'));

    // Hover over item
    act(() => {
      fireEvent.mouseOver(screen.getByText('item'));
    });

    await waitFor(() => screen.getAllByText('Tooltip title'));
    screen.getAllByText('Tooltip description');
  });
});