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
import { DropdownMenuContent } from './DropdownMenuContent';
import { MenuContents } from '../../types';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';

class ResizeObserver {
  observe() {}

  unobserve() {}
}

describe('<DropdownMenuContent />', () => {
  afterEach(cleanup);

  beforeAll(() => {
    // @ts-ignore
    window.DOMRect = { fromRect: () => ({}) };
    // @ts-ignore
    window.ResizeObserver = ResizeObserver;
  });

  it('renders children', async () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>
          <div data-testid="target" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>content</DropdownMenuContent>
      </DropdownMenu>,
    );

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
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>
          <div data-testid="target" />
        </DropdownMenuTrigger>
        <DropdownMenuContent content={menu} />
      </DropdownMenu>,
    );

    await waitFor(() => screen.getByText('item 1'));
    screen.getByText('Actions');
    screen.getByText('item 2');

    act(() => {
      fireEvent.click(screen.getByText('item 2'));
    });

    await waitFor(() => screen.getByText('sub item 1'));
  });
});