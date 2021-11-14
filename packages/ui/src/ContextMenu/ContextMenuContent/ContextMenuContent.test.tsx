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
import { ContextMenuContent } from './ContextMenuContent';
import { MenuContents } from '../../types';
import { ContextMenuTrigger } from '@radix-ui/react-context-menu';

class ResizeObserver {
  observe() {}

  unobserve() {}
}

describe('<ContextMenuContent />', () => {
  afterEach(cleanup);

  beforeAll(() => {
    // @ts-ignore
    window.DOMRect = { fromRect: () => ({}) };
    // @ts-ignore
    window.ResizeObserver = ResizeObserver;
  });

  it('renders children', async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid="target" />
        </ContextMenuTrigger>
        <ContextMenuContent>content</ContextMenuContent>
      </ContextMenu>,
    );

    act(() => {
      fireEvent.contextMenu(screen.getByTestId('target'));
    });

    await waitFor(() => screen.getByText('content'));
  });

  it('generates contents from menu prop', async () => {
    const menu: MenuContents = [
      {
        label: 'item 1',
        onSelect: jest.fn(),
      },
      'Actions',
      {
        label: 'item 2',
        onSelect: jest.fn(),
        submenu: [
          {
            label: 'sub item 1',
            onSelect: jest.fn(),
          },
        ],
      },
    ];

    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid="target" />
        </ContextMenuTrigger>
        <ContextMenuContent content={menu} />
      </ContextMenu>,
    );

    act(() => {
      fireEvent.contextMenu(screen.getByTestId('target'));
    });

    await waitFor(() => screen.getByText('item 1'));
    screen.getByText('Actions');
    screen.getByText('item 2');

    act(() => {
      fireEvent.click(screen.getByText('item 2'));
    });

    await waitFor(() => screen.getByText('sub item 1'));
  });
});