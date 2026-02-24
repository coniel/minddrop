/**
 * Menu.stories.tsx
 * Dev reference for Menu, MenuGroup, MenuLabel, MenuSeparator,
 * ColorSelectionMenuItem, and MenuItemDropdownMenu.
 */
import { IconButton } from '../IconButton';
import { Story, StoryItem, StoryRow, StorySection } from '../dev/Story';
import { ColorSelectionMenuItem } from './ColorSelectionMenuItem';
import { MenuGroup } from './MenuGroup';
import { MenuItem } from './MenuItem';
import { MenuLabel } from './MenuLabel';
import { MenuSeparator } from './MenuSeparator';

/* Wrapper that mimics a floating menu popup */
const MenuWrapper = ({
  children,
  width = 220,
}: {
  children: React.ReactNode;
  width?: number;
}) => (
  <div
    style={{
      background: 'var(--surface-overlay)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-overlay)',
      padding: 'var(--space-1) 0',
      width,
    }}
  >
    {children}
  </div>
);

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
          <MenuWrapper>
            <MenuItem label="Open" />
            <MenuItem label="Duplicate" />
            <MenuItem label="Rename" />
            <MenuItem label="Delete" danger />
          </MenuWrapper>
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
          <MenuWrapper>
            <MenuGroup padded>
              <MenuItem label="Open" />
              <MenuItem label="Duplicate" />
              <MenuItem label="Rename" />
            </MenuGroup>
          </MenuWrapper>
        </StoryItem>
        <StoryItem label="marginTop">
          <MenuWrapper>
            <MenuGroup>
              <MenuItem label="Open" />
              <MenuItem label="Duplicate" />
            </MenuGroup>
            <MenuGroup marginTop="small">
              <MenuItem label="Delete" danger />
            </MenuGroup>
          </MenuWrapper>
        </StoryItem>
      </StoryRow>

      {/* --------------------------------------------------------
          showActionsOnHover
          Group-level actions revealed on hover. The actions div
          sits at the bottom of the group and is hidden by default.
      -------------------------------------------------------- */}
      <StoryRow label="showActionsOnHover">
        <StoryItem label="hover the group">
          <MenuWrapper>
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
          </MenuWrapper>
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
          <MenuWrapper>
            <MenuLabel label="Workspaces" />
            <MenuItem label="Personal" />
            <MenuItem label="Team" />
          </MenuWrapper>
        </StoryItem>
        <StoryItem label="button">
          <MenuWrapper>
            <MenuLabel label="Workspaces" button onClick={() => {}} />
            <MenuItem label="Personal" />
            <MenuItem label="Team" />
          </MenuWrapper>
        </StoryItem>
        <StoryItem label="with actions (hover label)">
          <MenuWrapper>
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
          </MenuWrapper>
        </StoryItem>
        <StoryItem label="actionsAlwaysVisible">
          <MenuWrapper>
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
          </MenuWrapper>
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
          <MenuWrapper>
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
          </MenuWrapper>
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
          <MenuWrapper>
            <MenuItem label="Open" />
            <MenuItem label="Duplicate" />
            <MenuSeparator />
            <MenuItem label="Move to trash" danger />
          </MenuWrapper>
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
          <MenuWrapper width={180}>
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
          </MenuWrapper>
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
          <MenuWrapper width={240}>
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
          </MenuWrapper>
        </StoryItem>
      </StoryRow>
    </StorySection>
  </Story>
);
