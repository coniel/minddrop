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
import { MenuRenameItem } from './MenuRenameItem';
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
            <MenuItem stringLabel="Open" />
            <MenuItem stringLabel="Duplicate" />
            <MenuItem stringLabel="Rename" />
            <MenuItem stringLabel="Delete" danger />
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
              <MenuItem stringLabel="Open" />
              <MenuItem stringLabel="Duplicate" />
              <MenuItem stringLabel="Rename" />
            </MenuGroup>
          </Menu>
        </StoryItem>
        <StoryItem label="marginTop">
          <Menu>
            <MenuGroup>
              <MenuItem stringLabel="Open" />
              <MenuItem stringLabel="Duplicate" />
            </MenuGroup>
            <MenuGroup marginTop="small">
              <MenuItem stringLabel="Delete" danger />
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
                    stringLabel="Add item"
                  />
                </div>
              }
            >
              <MenuItem stringLabel="Item one" />
              <MenuItem stringLabel="Item two" />
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
            <MenuLabel stringLabel="Workspaces" />
            <MenuItem stringLabel="Personal" />
            <MenuItem stringLabel="Team" />
          </Menu>
        </StoryItem>
        <StoryItem label="button">
          <Menu>
            <MenuLabel stringLabel="Workspaces" button onClick={() => {}} />
            <MenuItem stringLabel="Personal" />
            <MenuItem stringLabel="Team" />
          </Menu>
        </StoryItem>
        <StoryItem label="with actions (hover label)">
          <Menu>
            <MenuLabel
              stringLabel="Projects"
              actions={
                <IconButton
                  variant="ghost"
                  size="sm"
                  icon="plus"
                  stringLabel="New project"
                />
              }
            />
            <MenuItem stringLabel="Alpha" />
            <MenuItem stringLabel="Beta" />
          </Menu>
        </StoryItem>
        <StoryItem label="actionsAlwaysVisible">
          <Menu>
            <MenuLabel
              stringLabel="Projects"
              actionsAlwaysVisible
              actions={
                <IconButton
                  variant="ghost"
                  size="sm"
                  icon="plus"
                  stringLabel="New project"
                />
              }
            />
            <MenuItem stringLabel="Alpha" />
            <MenuItem stringLabel="Beta" />
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
                stringLabel="Projects"
                actions={
                  <IconButton
                    variant="ghost"
                    size="sm"
                    icon="plus"
                    stringLabel="New project"
                  />
                }
              />
              <MenuItem stringLabel="Alpha" />
              <MenuItem stringLabel="Beta" />
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
            <MenuItem stringLabel="Open" />
            <MenuItem stringLabel="Duplicate" />
            <MenuSeparator />
            <MenuItem stringLabel="Move to trash" danger />
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
              <MenuRadioItem value="list" stringLabel="List" />
              <MenuRadioItem value="grid" stringLabel="Grid" />
              <MenuRadioItem value="columns" stringLabel="Columns" />
            </MenuRadioGroup>
          </Menu>
        </StoryItem>
        <StoryItem label="with icons">
          <Menu>
            <MenuRadioGroup defaultValue="grid">
              <MenuRadioItem value="list" stringLabel="List" icon="list" />
              <MenuRadioItem value="grid" stringLabel="Grid" icon="grid-2x2" />
              <MenuRadioItem
                value="columns"
                stringLabel="Columns"
                icon="columns-2"
              />
            </MenuRadioGroup>
          </Menu>
        </StoryItem>
        <StoryItem label="compact">
          <Menu>
            <MenuRadioGroup defaultValue="sm">
              <MenuRadioItem value="sm" stringLabel="Small" size="compact" />
              <MenuRadioItem value="md" stringLabel="Medium" size="compact" />
              <MenuRadioItem value="lg" stringLabel="Large" size="compact" />
            </MenuRadioGroup>
          </Menu>
        </StoryItem>
        <StoryItem label="disabled items">
          <Menu>
            <MenuRadioGroup defaultValue="enabled">
              <MenuRadioItem value="enabled" stringLabel="Enabled" />
              <MenuRadioItem value="disabled" stringLabel="Disabled" disabled />
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
            <SwitchMenuItem stringLabel="Show grid" />
            <SwitchMenuItem stringLabel="Snap to grid" defaultChecked />
            <SwitchMenuItem stringLabel="Dark mode" icon="moon" />
          </Menu>
        </StoryItem>
        <StoryItem label="disabled">
          <Menu>
            <SwitchMenuItem stringLabel="Enabled" defaultChecked />
            <SwitchMenuItem stringLabel="Disabled off" disabled />
            <SwitchMenuItem stringLabel="Disabled on" disabled checked />
          </Menu>
        </StoryItem>
        <StoryItem label="compact">
          <Menu>
            <SwitchMenuItem stringLabel="Compact item" size="compact" />
            <SwitchMenuItem
              stringLabel="Compact checked"
              size="compact"
              defaultChecked
            />
          </Menu>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        MENU RENAME ITEM
        Inline rename input at the top of a menu, outside
        keyboard navigation. Optionally includes an icon
        selection button.
    -------------------------------------------------------- */}
    <StorySection
      title="MenuRenameItem"
      description="Inline rename input at the top of a menu, outside keyboard navigation. Icon button only appears when contentIcon is provided."
    >
      <StoryRow>
        <StoryItem label="without icon">
          <Menu>
            <MenuRenameItem
              value="My View"
              onValueChange={() => {}}
              onRename={() => {}}
            />
            <MenuSeparator />
            <MenuItem stringLabel="Duplicate" icon="copy" />
            <MenuItem stringLabel="Delete" icon="trash" danger />
          </Menu>
        </StoryItem>
        <StoryItem label="with icon picker">
          <Menu>
            <MenuRenameItem
              value="My View"
              contentIcon="content-icon:shapes:circle:blue"
              onValueChange={() => {}}
              onRename={() => {}}
              onSelectIcon={() => {}}
            />
            <MenuSeparator />
            <MenuItem stringLabel="Duplicate" icon="copy" />
            <MenuItem stringLabel="Delete" icon="trash" danger />
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
                stringLabel="Projects"
                actions={
                  <IconButton
                    variant="ghost"
                    size="sm"
                    icon="plus"
                    stringLabel="New project"
                  />
                }
              />
              <MenuItem
                icon="folder"
                stringLabel="Project Alpha"
                actions={
                  <IconButton
                    variant="ghost"
                    size="sm"
                    icon="more-horizontal"
                    stringLabel="More"
                  />
                }
              />
              <MenuItem
                icon="folder"
                stringLabel="Project Beta"
                active
                actions={
                  <IconButton
                    variant="ghost"
                    size="sm"
                    icon="more-horizontal"
                    stringLabel="More"
                  />
                }
              />
              <MenuItem
                icon="folder"
                stringLabel="Project Gamma"
                actions={
                  <IconButton
                    variant="ghost"
                    size="sm"
                    icon="more-horizontal"
                    stringLabel="More"
                  />
                }
              />
            </MenuGroup>
            <MenuSeparator />
            <MenuGroup>
              <MenuItem icon="settings" stringLabel="Settings" />
              <MenuItem icon="trash" stringLabel="Trash" muted />
            </MenuGroup>
          </Menu>
        </StoryItem>
      </StoryRow>
    </StorySection>
  </Story>
);
