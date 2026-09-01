import { afterEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from '@minddrop/test-utils';
import {
  Anchor,
  MenuContents,
  MenuItem,
  Popover,
} from '@minddrop/ui-primitives';
import { SidebarGroup } from './SidebarGroup';

// The group's menu, carrying a single action
const menu: MenuContents = [
  { type: 'menu-item', stringLabel: 'Rename', onSelect: () => {} },
];

describe('<SidebarGroup />', () => {
  afterEach(cleanup);

  it('renders no add or options buttons by default', () => {
    render(
      <SidebarGroup stringLabel="Group">
        <MenuItem stringLabel="Item" />
      </SidebarGroup>,
    );

    expect(screen.queryByLabelText('actions.new')).toBeNull();
    expect(screen.queryByLabelText('actions.options')).toBeNull();
  });

  it('opens the menu from the options button', async () => {
    const user = userEvent.setup();

    render(<SidebarGroup stringLabel="Group" menu={menu} />);

    await user.click(screen.getByLabelText('actions.options'));

    screen.getByText('Rename');
  });

  it('opens the menu as the group context menu', () => {
    render(<SidebarGroup stringLabel="Group" menu={menu} />);

    fireEvent.contextMenu(screen.getByText('Group'));

    screen.getByText('Rename');
  });

  it('highlights the label while its menu is open', async () => {
    const user = userEvent.setup();

    render(<SidebarGroup stringLabel="Group" menu={menu} />);

    const groupLabel = screen.getByText('Group').closest('.menu-label');

    await user.click(screen.getByLabelText('actions.options'));

    expect(groupLabel).toHaveClass('menu-label-active');

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(groupLabel).not.toHaveClass('menu-label-active');
    });
  });

  it('highlights the label while a popover opened from it is open', async () => {
    const { rerender } = render(
      <SidebarGroup
        stringLabel="Group"
        menu={menu}
        popovers={() => <Popover open={false} />}
      />,
    );

    const groupLabel = screen.getByText('Group').closest('.menu-label');

    expect(groupLabel).not.toHaveClass('menu-label-active');

    // Open the popover the way a menu action would, by the
    // consumer's own state rather than an interaction
    rerender(
      <SidebarGroup
        stringLabel="Group"
        menu={menu}
        popovers={() => <Popover open />}
      />,
    );

    await waitFor(() => {
      expect(groupLabel).toHaveClass('menu-label-active');
    });
  });

  it('anchors popovers at the point the menu was opened from', () => {
    const anchors: Anchor[] = [];

    render(
      <SidebarGroup
        stringLabel="Group"
        menu={menu}
        popovers={({ anchor }) => {
          anchors.push(anchor);

          return null;
        }}
      />,
    );

    fireEvent.contextMenu(screen.getByText('Group'), {
      clientX: 40,
      clientY: 24,
    });

    const anchor = anchors[anchors.length - 1] as {
      getBoundingClientRect: () => Record<string, number>;
    };

    expect(anchor.getBoundingClientRect()).toMatchObject({ x: 40, y: 24 });
  });

  it('fires the add callback when the add button is clicked', async () => {
    const user = userEvent.setup();
    let clicked = false;

    render(
      <SidebarGroup
        stringLabel="Group"
        onAddClick={() => {
          clicked = true;
        }}
      />,
    );

    await user.click(screen.getByLabelText('actions.new'));

    expect(clicked).toBe(true);
  });

  it('opens the add popover from the add button', async () => {
    const user = userEvent.setup();

    render(
      <SidebarGroup
        stringLabel="Group"
        addPopover={({ open }) => (open ? <div>Add form</div> : null)}
      />,
    );

    await user.click(screen.getByLabelText('actions.new'));

    screen.getByText('Add form');
  });
});
