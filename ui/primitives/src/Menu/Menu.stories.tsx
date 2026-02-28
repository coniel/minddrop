/**
 * Menu.stories.tsx
 * Dev reference for Menu, MenuGroup, MenuLabel, MenuSeparator,
 * MenuRadioGroup, MenuRadioItem, ColorSelectionMenuItem,
 * and MenuItemDropdownMenu.
 */
import { IconButton } from '../IconButton';
import { Story, StoryItem, StoryRow, StorySection } from '../dev/Story';
import { ColorSelectionMenuItem } from './ColorSelectionMenuItem';
import { Menu } from './Menu';
import { MenuGroup } from './MenuGroup';
import { MenuItem } from './MenuItem';
import { MenuLabel } from './MenuLabel';
import { MenuRadioGroup } from './MenuRadioGroup';
import { MenuRadioItem } from './MenuRadioItem';
import { MenuSeparator } from './MenuSeparator';
import { SwitchMenuItem } from './SwitchMenuItem';

export const MenuStories = () => (
  <Story title="Menu">
    {/* --------------------------------------------------------
        MENU
        The popup container. Can be used standalone or composed
        inside DropdownMenu/ContextMenu. Includes enter/exit
        scale animation via data-starting-style/data-ending-style.
    -------------------------------------------------------- */}
    <StorySection
      title="Menu"
      description="The popup container. Scale animation is applied via data-starting/ending-style attributes from the Base UI positioner."
    >
      <StoryRow>
        <StoryItem label="basic menu">
          <Menu>
            <MenuItem label="Open" />
            <MenuItem label="Duplicate" />
            <MenuItem label="Rename" />
            <MenuItem label="Delete" danger />
          </Menu>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        MENU GROUP
        Groups related items. Optionally padded (adds horizontal
        inset) or spaced from adjacent groups via marginTop.
    -------------------------------------------------------- */}
    <StorySection
      title="MenuGroup"
      description="Groups related items. Padded adds horizontal inset to sit items off the menu edge. marginTop separates groups vertically."
    >
      <StoryRow>
        <StoryItem label="padded">
          <Menu>
            <MenuGroup padded>
              <MenuItem label="Open" />
              <MenuItem label="Duplicate" />
              <MenuItem label="Rename" />
            </MenuGroup>
          </Menu>
        </StoryItem>
        <StoryItem label="marginTop">
          <Menu>
            <MenuGroup>
              <MenuItem label="Open" />
              <MenuItem label="Duplicate" />
            </MenuGroup>
            <MenuGroup marginTop="small">
              <MenuItem label="Delete" danger />
            </MenuGroup>
          </Menu>
        </StoryItem>
      </StoryRow>

      {/* --------------------------------------------------------
          showActionsOnHover
          Group-level actions revealed on hover. The actions div
          sits at the bottom of the group and is hidden by default.
      -------------------------------------------------------- */}
      <StoryRow label="showActionsOnHover">
        <StoryItem label="hover the group">
          <Menu>
            <MenuGroup
              showActionsOnHover
              actions={
                <div
                  style={{
                    padding: '0 var(--space-2) var(--space-1)',
                    display: 'flex',
                    gap: 'var(--space-1)',
                  }}
                >
                  <IconButton
                    variant="ghost"
                    size="sm"
                    icon="plus"
                    label="Add item"
                  />
                </div>
              }
            >
              <MenuItem label="Item one" />
              <MenuItem label="Item two" />
            </MenuGroup>
          </Menu>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        MENU LABEL
        Section heading within a menu. Can be made interactive
        with the button prop. Actions reveal on hover by default.
    -------------------------------------------------------- */}
    <StorySection
      title="MenuLabel"
      description="Section heading. Use button to make it interactive. Actions reveal on hover unless actionsAlwaysVisible is set."
    >
      <StoryRow>
        <StoryItem label="basic">
          <Menu>
            <MenuLabel label="Workspaces" />
            <MenuItem label="Personal" />
            <MenuItem label="Team" />
          </Menu>
        </StoryItem>
        <StoryItem label="button">
          <Menu>
            <MenuLabel label="Workspaces" button onClick={() => {}} />
            <MenuItem label="Personal" />
            <MenuItem label="Team" />
          </Menu>
        </StoryItem>
        <StoryItem label="with actions (hover label)">
          <Menu>
            <MenuLabel
              label="Projects"
              actions={
                <IconButton
                  variant="ghost"
                  size="sm"
                  icon="plus"
                  label="New project"
                />
              }
            />
            <MenuItem label="Alpha" />
            <MenuItem label="Beta" />
          </Menu>
        </StoryItem>
        <StoryItem label="actionsAlwaysVisible">
          <Menu>
            <MenuLabel
              label="Projects"
              actionsAlwaysVisible
              actions={
                <IconButton
                  variant="ghost"
                  size="sm"
                  icon="plus"
                  label="New project"
                />
              }
            />
            <MenuItem label="Alpha" />
            <MenuItem label="Beta" />
          </Menu>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        SHOWLABELACTIONSONHOVER
        The group reveals the MenuLabel's actions when hovered,
        rather than the label itself having to be hovered.
        Useful for sidebar sections where the label is small.
    -------------------------------------------------------- */}
    <StorySection
      title="showLabelActionsOnHover"
      description="Reveals the MenuLabel's actions when the entire group is hovered — useful for sidebar nav sections with small labels."
    >
      <StoryRow>
        <StoryItem label="hover the group">
          <Menu>
            <MenuGroup showLabelActionsOnHover>
              <MenuLabel
                label="Projects"
                actions={
                  <IconButton
                    variant="ghost"
                    size="sm"
                    icon="plus"
                    label="New project"
                  />
                }
              />
              <MenuItem label="Alpha" />
              <MenuItem label="Beta" />
            </MenuGroup>
          </Menu>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        MENU SEPARATOR
        A horizontal rule between groups. Delegates sizing and
        spacing to the Separator component.
    -------------------------------------------------------- */}
    <StorySection
      title="MenuSeparator"
      description="Horizontal divider between groups. Sizing and margin are handled by the Separator component."
    >
      <StoryRow>
        <StoryItem label="separator">
          <Menu>
            <MenuItem label="Open" />
            <MenuItem label="Duplicate" />
            <MenuSeparator />
            <MenuItem label="Move to trash" danger />
          </Menu>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        COLOR SELECTION MENU ITEM
        Represents a user-selectable content color. The color
        swatch uses the content color scales from the theme.
        'default' renders a neutral bordered circle.
    -------------------------------------------------------- */}
    <StorySection
      title="ColorSelectionMenuItem"
      description="Color picker items using the content color scales. 'default' renders a neutral swatch for removing color."
    >
      <StoryRow>
        <StoryItem label="all colors">
          <Menu>
            <ColorSelectionMenuItem color="default" />
            <ColorSelectionMenuItem color="gray" />
            <ColorSelectionMenuItem color="red" />
            <ColorSelectionMenuItem color="orange" />
            <ColorSelectionMenuItem color="yellow" />
            <ColorSelectionMenuItem color="green" />
            <ColorSelectionMenuItem color="cyan" />
            <ColorSelectionMenuItem color="blue" />
            <ColorSelectionMenuItem color="purple" />
            <ColorSelectionMenuItem color="pink" />
            <ColorSelectionMenuItem color="brown" />
          </Menu>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        RADIO GROUP + RADIO ITEM
        Radio groups allow single-selection from a group of
        options. Supports controlled and uncontrolled usage.
    -------------------------------------------------------- */}
    <StorySection
      title="MenuRadioGroup + MenuRadioItem"
      description="Radio group for single selection. Uncontrolled with defaultValue or controlled with value + onValueChange."
    >
      <StoryRow>
        <StoryItem label="uncontrolled">
          <Menu>
            <MenuRadioGroup defaultValue="grid">
              <MenuRadioItem value="list" label="List" />
              <MenuRadioItem value="grid" label="Grid" />
              <MenuRadioItem value="columns" label="Columns" />
            </MenuRadioGroup>
          </Menu>
        </StoryItem>
        <StoryItem label="with icons">
          <Menu>
            <MenuRadioGroup defaultValue="grid">
              <MenuRadioItem value="list" label="List" icon="list" />
              <MenuRadioItem value="grid" label="Grid" icon="grid-2x2" />
              <MenuRadioItem value="columns" label="Columns" icon="columns-2" />
            </MenuRadioGroup>
          </Menu>
        </StoryItem>
        <StoryItem label="compact">
          <Menu>
            <MenuRadioGroup defaultValue="sm">
              <MenuRadioItem value="sm" label="Small" size="compact" />
              <MenuRadioItem value="md" label="Medium" size="compact" />
              <MenuRadioItem value="lg" label="Large" size="compact" />
            </MenuRadioGroup>
          </Menu>
        </StoryItem>
        <StoryItem label="disabled items">
          <Menu>
            <MenuRadioGroup defaultValue="enabled">
              <MenuRadioItem value="enabled" label="Enabled" />
              <MenuRadioItem value="disabled" label="Disabled" disabled />
            </MenuRadioGroup>
          </Menu>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        SWITCH MENU ITEM
        Menu item with a toggle switch on the right. Clicking
        anywhere on the row toggles the switch. Supports both
        controlled and uncontrolled usage.
    -------------------------------------------------------- */}
    <StorySection
      title="SwitchMenuItem"
      description="Menu item with a toggle switch. Click anywhere on the row to toggle. Works in DropdownMenu and ContextMenu."
    >
      <StoryRow>
        <StoryItem label="uncontrolled">
          <Menu>
            <SwitchMenuItem label="Show grid" />
            <SwitchMenuItem label="Snap to grid" defaultChecked />
            <SwitchMenuItem label="Dark mode" icon="moon" />
          </Menu>
        </StoryItem>
        <StoryItem label="disabled">
          <Menu>
            <SwitchMenuItem label="Enabled" defaultChecked />
            <SwitchMenuItem label="Disabled off" disabled />
            <SwitchMenuItem label="Disabled on" disabled checked />
          </Menu>
        </StoryItem>
        <StoryItem label="compact">
          <Menu>
            <SwitchMenuItem label="Compact item" size="compact" />
            <SwitchMenuItem
              label="Compact checked"
              size="compact"
              defaultChecked
            />
          </Menu>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        FULL COMPOSITION
        A realistic sidebar nav section combining MenuGroup,
        MenuLabel with hover actions, MenuItems with hover
        actions, and a separator.
    -------------------------------------------------------- */}
    <StorySection
      title="Full composition"
      description="Realistic sidebar nav pattern combining all menu primitives."
    >
      <StoryRow>
        <StoryItem label="sidebar section">
          <Menu>
            <MenuGroup showLabelActionsOnHover>
              <MenuLabel
                label="Projects"
                actions={
                  <IconButton
                    variant="ghost"
                    size="sm"
                    icon="plus"
                    label="New project"
                  />
                }
              />
              <MenuItem
                icon="folder"
                label="Project Alpha"
                actions={
                  <IconButton
                    variant="ghost"
                    size="sm"
                    icon="more-horizontal"
                    label="More"
                  />
                }
              />
              <MenuItem
                icon="folder"
                label="Project Beta"
                active
                actions={
                  <IconButton
                    variant="ghost"
                    size="sm"
                    icon="more-horizontal"
                    label="More"
                  />
                }
              />
              <MenuItem
                icon="folder"
                label="Project Gamma"
                actions={
                  <IconButton
                    variant="ghost"
                    size="sm"
                    icon="more-horizontal"
                    label="More"
                  />
                }
              />
            </MenuGroup>
            <MenuSeparator />
            <MenuGroup>
              <MenuItem icon="settings" label="Settings" />
              <MenuItem icon="trash" label="Trash" muted />
            </MenuGroup>
          </Menu>
        </StoryItem>
      </StoryRow>
    </StorySection>
  </Story>
);
