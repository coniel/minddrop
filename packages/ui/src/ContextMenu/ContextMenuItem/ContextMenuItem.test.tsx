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
import { ContextMenu } from '../ContextMenu';
import { ContextMenuContent } from '../ContextMenuContent';
import { ContextMenuItem } from './ContextMenuItem';
import { ContextMenuTrigger } from '@radix-ui/react-context-menu';

class ResizeObserver {
  observe() {}

  unobserve() {}
}

describe('<ContextMenuItem />', () => {
  afterEach(cleanup);

  beforeAll(() => {
    // @ts-ignore
    window.DOMRect = { fromRect: () => ({}) };
    // @ts-ignore
    window.ResizeObserver = ResizeObserver;
  });

  it('renders tooltip title and description', async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid="target" />
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            label="item"
            onSelect={jest.fn()}
            tooltipTitle="Tooltip title"
            tooltipDescription="Tooltip description"
          />
        </ContextMenuContent>
      </ContextMenu>,
    );

    // Open menu
    act(() => {
      fireEvent.contextMenu(screen.getByTestId('target'));
    });

    await waitFor(() => screen.getByRole('menuitem'));

    // Hover over item
    act(() => {
      fireEvent.mouseOver(screen.getByRole('menuitem'));
    });

    await waitFor(() => screen.getAllByText('Tooltip title'));
    screen.getAllByText('Tooltip description');
  });
});
