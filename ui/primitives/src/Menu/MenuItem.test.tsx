import { afterEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from '@minddrop/test-utils';
import { Popover } from '../Popover';
import { Anchor, MenuContents } from '../types';
import { MenuItem } from './MenuItem';

// The item's menu, carrying a single action
const menu: MenuContents = [
  { type: 'menu-item', stringLabel: 'Rename', onSelect: () => {} },
];

describe('<MenuItem />', () => {
  afterEach(cleanup);

  it('renders no options button without a menu', () => {
    render(<MenuItem stringLabel="Item" />);

    expect(screen.queryByLabelText('actions.options')).toBeNull();
  });

  it('opens the menu from the options button', async () => {
    const user = userEvent.setup();

    render(<MenuItem stringLabel="Item" menu={menu} />);

    await user.click(screen.getByLabelText('actions.options'));

    screen.getByText('Rename');
  });

  it('labels the options button with the given label', () => {
    render(
      <MenuItem stringLabel="Item" menu={menu} menuLabel="actions.edit" />,
    );

    screen.getByLabelText('actions.edit');
  });

  it('opens the menu as the item context menu', () => {
    render(<MenuItem stringLabel="Item" menu={menu} />);

    // The trigger is merged onto the item itself rather than
    // wrapping it
    fireEvent.contextMenu(screen.getByRole('menuitem'));

    screen.getByText('Rename');
  });

  it('highlights the item while its context menu is open', async () => {
    render(<MenuItem stringLabel="Item" menu={menu} />);

    const item = screen.getByRole('menuitem');

    fireEvent.contextMenu(item);

    expect(item).toHaveClass('menu-item-force-actions-visible');

    // Close the menu
    fireEvent.keyDown(document.activeElement ?? document.body, {
      key: 'Escape',
    });

    await waitFor(() => {
      expect(item).not.toHaveClass('menu-item-force-actions-visible');
    });
  });

  it('highlights the item while a popover opened from it is open', async () => {
    const { rerender } = render(
      <MenuItem
        stringLabel="Item"
        menu={menu}
        popovers={() => <Popover open={false} />}
      />,
    );

    const item = screen.getByRole('menuitem');

    expect(item).not.toHaveClass('menu-item-force-actions-visible');

    // Open the popover the way a menu action would, by the
    // consumer's own state rather than an interaction
    rerender(
      <MenuItem
        stringLabel="Item"
        menu={menu}
        popovers={() => <Popover open />}
      />,
    );

    await waitFor(() => {
      expect(item).toHaveClass('menu-item-force-actions-visible');
    });
  });

  it('anchors popovers at the point the menu was opened from', () => {
    const anchors: Anchor[] = [];

    render(
      <MenuItem
        stringLabel="Item"
        menu={menu}
        popovers={({ anchor }) => {
          anchors.push(anchor);

          return null;
        }}
      />,
    );

    fireEvent.contextMenu(screen.getByRole('menuitem'), {
      clientX: 40,
      clientY: 24,
    });

    const anchor = anchors[anchors.length - 1] as {
      getBoundingClientRect: () => Record<string, number>;
    };

    expect(anchor.getBoundingClientRect()).toMatchObject({ x: 40, y: 24 });
  });

  it('anchors popovers at the options button before a menu is opened', () => {
    const anchors: Anchor[] = [];

    render(
      <MenuItem
        stringLabel="Item"
        menu={menu}
        popovers={({ anchor }) => {
          anchors.push(anchor);

          return null;
        }}
      />,
    );

    expect(anchors[0]).toHaveProperty(
      'current',
      screen.getByLabelText('actions.options'),
    );
  });

  it('anchors popovers at the options button the dropdown was opened from', async () => {
    const user = userEvent.setup();
    const anchors: Anchor[] = [];

    render(
      <MenuItem
        stringLabel="Item"
        menu={menu}
        popovers={({ anchor }) => {
          anchors.push(anchor);

          return null;
        }}
      />,
    );

    // Open via the context menu first, so a click position is
    // recorded to be replaced
    fireEvent.contextMenu(screen.getByRole('menuitem'), {
      clientX: 40,
      clientY: 24,
    });
    fireEvent.keyDown(document.activeElement ?? document.body, {
      key: 'Escape',
    });

    await user.click(screen.getByLabelText('actions.options'));

    const anchor = anchors[anchors.length - 1] as {
      getBoundingClientRect: () => Record<string, number>;
    };

    // The button's own position, rather than the click position
    expect(anchor.getBoundingClientRect()).toMatchObject({ x: 0, y: 0 });
  });
});
