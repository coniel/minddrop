import { ContextMenuTrigger } from '@radix-ui/react-context-menu';
import { afterEach, beforeAll, describe, it, vi } from 'vitest';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@minddrop/test-utils';
import { MenuContents } from '../../types';
import { ContextMenu } from '../ContextMenu';
import { ContextMenuContent } from './ContextMenuContent';

class ResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
}

describe('<ContextMenuContent />', () => {
  afterEach(cleanup);

  beforeAll(() => {
    // @ts-expect-error Sufficient for test
    window.DOMRect = { fromRect: () => ({}) };
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
        type: 'menu-item',
        label: 'item 1',
        onSelect: vi.fn(),
      },
      {
        type: 'menu-label',
        label: 'Actions',
      },
      {
        type: 'menu-item',
        label: 'item 2',
        onSelect: vi.fn(),
        submenu: [
          {
            type: 'menu-item',
            label: 'sub item 1',
            onSelect: vi.fn(),
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
