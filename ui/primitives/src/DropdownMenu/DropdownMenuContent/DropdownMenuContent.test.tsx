import { Menu } from '@base-ui-components/react/menu';
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
import { DropdownMenu } from '../DropdownMenu';
import { DropdownMenuContent } from './DropdownMenuContent';

class ResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
}

describe('<DropdownMenuContent />', () => {
  afterEach(cleanup);

  beforeAll(() => {
    // @ts-expect-error Sufficient for test
    window.DOMRect = { fromRect: () => ({}) };
    window.ResizeObserver = ResizeObserver;
  });

  it('renders children', async () => {
    render(
      <DropdownMenu defaultOpen>
        <Menu.Trigger>
          <div data-testid="target" />
        </Menu.Trigger>
        <DropdownMenuContent>content</DropdownMenuContent>
      </DropdownMenu>,
    );

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
      <DropdownMenu defaultOpen>
        <Menu.Trigger>
          <div data-testid="target" />
        </Menu.Trigger>
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
