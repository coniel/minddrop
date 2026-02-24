/**
 * ContextMenu.stories.tsx
 * Dev reference for the ContextMenu component system.
 */
import { useState } from 'react';
import { Text } from '../Text';
import { Story, StoryItem, StoryRow, StorySection } from '../dev/Story';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuPositioner,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextSubmenu,
  ContextSubmenuContent,
  ContextSubmenuTriggerItem,
} from './ContextMenu';

export const ContextMenuStories = () => {
  const [view, setView] = useState('grid');
  const [lastAction, setLastAction] = useState<string | null>(null);

  const action = (label: string) => () => setLastAction(label);

  const TriggerArea = ({
    label,
    children,
  }: {
    label?: string;
    children?: React.ReactNode;
  }) => (
    <div
      style={{
        width: 240,
        height: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border-default)',
        background: 'var(--surface-subtle)',
        userSelect: 'none',
      }}
    >
      <Text size="sm" color="subtle">
        {label ?? 'Right-click here'}
      </Text>
      {children}
    </div>
  );

  return (
    <Story title="ContextMenu">
      {/* --------------------------------------------------------
          BASIC
          ContextMenuTrigger wraps any region as the right-click
          target. Unlike DropdownMenu, no visible trigger element
          is needed.
      -------------------------------------------------------- */}
      <StorySection
        title="Basic"
        description="ContextMenuTrigger wraps any region as the right-click target. The menu opens at the cursor position."
      >
        <StoryRow>
          <StoryItem label="basic">
            <ContextMenu>
              <ContextMenuTrigger>
                <TriggerArea />
              </ContextMenuTrigger>
              <ContextMenuPortal>
                <ContextMenuPositioner>
                  <ContextMenuContent minWidth={180}>
                    <ContextMenuItem label="Cut" onClick={action('Cut')} />
                    <ContextMenuItem label="Copy" onClick={action('Copy')} />
                    <ContextMenuItem label="Paste" onClick={action('Paste')} />
                  </ContextMenuContent>
                </ContextMenuPositioner>
              </ContextMenuPortal>
            </ContextMenu>
            {lastAction && (
              <Text size="sm" color="muted">
                → {lastAction}
              </Text>
            )}
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          GROUPS + LABELS
      -------------------------------------------------------- */}
      <StorySection
        title="Groups and labels"
        description="ContextMenuGroup wraps items with an optional label. ContextMenuLabel renders a standalone section heading."
      >
        <StoryRow>
          <StoryItem label="grouped">
            <ContextMenu>
              <ContextMenuTrigger>
                <TriggerArea />
              </ContextMenuTrigger>
              <ContextMenuPortal>
                <ContextMenuPositioner>
                  <ContextMenuContent minWidth={200}>
                    <ContextMenuGroup label="Edit">
                      <ContextMenuItem
                        label="Cut"
                        icon="scissors"
                        onClick={action('Cut')}
                      />
                      <ContextMenuItem
                        label="Copy"
                        icon="copy"
                        onClick={action('Copy')}
                      />
                      <ContextMenuItem
                        label="Paste"
                        icon="clipboard"
                        onClick={action('Paste')}
                      />
                    </ContextMenuGroup>
                    <ContextMenuSeparator />
                    <ContextMenuGroup label="View">
                      <ContextMenuItem
                        label="Zoom in"
                        icon="zoom-in"
                        onClick={action('Zoom in')}
                      />
                      <ContextMenuItem
                        label="Zoom out"
                        icon="zoom-out"
                        onClick={action('Zoom out')}
                      />
                    </ContextMenuGroup>
                  </ContextMenuContent>
                </ContextMenuPositioner>
              </ContextMenuPortal>
            </ContextMenu>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          SHIFT SECONDARY STATE
      -------------------------------------------------------- */}
      <StorySection
        title="Shift secondary state"
        description="Hold Shift to reveal secondary labels, icons, and handlers."
      >
        <StoryRow>
          <StoryItem label="shift to delete">
            <ContextMenu>
              <ContextMenuTrigger>
                <TriggerArea />
              </ContextMenuTrigger>
              <ContextMenuPortal>
                <ContextMenuPositioner>
                  <ContextMenuContent minWidth={200}>
                    <ContextMenuItem
                      label="Archive"
                      icon="archive"
                      secondaryLabel="Delete"
                      secondaryIcon="trash"
                      onClick={action('Archive')}
                      secondaryOnClick={action('Delete')}
                    />
                    <ContextMenuItem
                      label="Move to..."
                      icon="folder"
                      onClick={action('Move')}
                    />
                  </ContextMenuContent>
                </ContextMenuPositioner>
              </ContextMenuPortal>
            </ContextMenu>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          RADIO GROUP
      -------------------------------------------------------- */}
      <StorySection
        title="Radio group"
        description="Same RadioGroup/RadioItem API as DropdownMenu."
      >
        <StoryRow>
          <StoryItem label={`view: ${view}`}>
            <ContextMenu>
              <ContextMenuTrigger>
                <TriggerArea />
              </ContextMenuTrigger>
              <ContextMenuPortal>
                <ContextMenuPositioner>
                  <ContextMenuContent minWidth={160}>
                    <ContextMenuGroup label="View as">
                      <ContextMenuRadioGroup
                        value={view}
                        onValueChange={setView}
                      >
                        <ContextMenuRadioItem value="list" label="List" />
                        <ContextMenuRadioItem value="grid" label="Grid" />
                        <ContextMenuRadioItem value="columns" label="Columns" />
                      </ContextMenuRadioGroup>
                    </ContextMenuGroup>
                  </ContextMenuContent>
                </ContextMenuPositioner>
              </ContextMenuPortal>
            </ContextMenu>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          SUBMENU
      -------------------------------------------------------- */}
      <StorySection
        title="Submenu"
        description="Same Submenu API as DropdownMenu. Keyboard navigation works across levels."
      >
        <StoryRow>
          <StoryItem label="with submenu">
            <ContextMenu>
              <ContextMenuTrigger>
                <TriggerArea />
              </ContextMenuTrigger>
              <ContextMenuPortal>
                <ContextMenuPositioner>
                  <ContextMenuContent minWidth={200}>
                    <ContextMenuItem label="Open" onClick={action('Open')} />
                    <ContextSubmenu>
                      <ContextSubmenuTriggerItem
                        label="Open with"
                        icon="external-link"
                      />
                      <ContextMenuPortal>
                        <ContextMenuPositioner>
                          <ContextSubmenuContent minWidth={160}>
                            <ContextMenuItem
                              label="Preview"
                              onClick={action('Preview')}
                            />
                            <ContextMenuItem
                              label="Editor"
                              onClick={action('Editor')}
                            />
                            <ContextMenuItem
                              label="Browser"
                              onClick={action('Browser')}
                            />
                          </ContextSubmenuContent>
                        </ContextMenuPositioner>
                      </ContextMenuPortal>
                    </ContextSubmenu>
                    <ContextMenuSeparator />
                    <ContextMenuItem
                      label="Move to trash"
                      icon="trash"
                      onClick={action('Trash')}
                    />
                  </ContextMenuContent>
                </ContextMenuPositioner>
              </ContextMenuPortal>
            </ContextMenu>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          DISABLED ITEMS
      -------------------------------------------------------- */}
      <StorySection
        title="Disabled items"
        description="Disabled items are skipped during keyboard navigation."
      >
        <StoryRow>
          <StoryItem label="with disabled">
            <ContextMenu>
              <ContextMenuTrigger>
                <TriggerArea />
              </ContextMenuTrigger>
              <ContextMenuPortal>
                <ContextMenuPositioner>
                  <ContextMenuContent minWidth={160}>
                    <ContextMenuItem label="Cut" onClick={action('Cut')} />
                    <ContextMenuItem
                      label="Copy"
                      disabled
                      onClick={action('Copy')}
                    />
                    <ContextMenuItem
                      label="Paste"
                      disabled
                      onClick={action('Paste')}
                    />
                    <ContextMenuSeparator />
                    <ContextMenuItem
                      label="Select all"
                      onClick={action('Select all')}
                    />
                  </ContextMenuContent>
                </ContextMenuPositioner>
              </ContextMenuPortal>
            </ContextMenu>
          </StoryItem>
        </StoryRow>
      </StorySection>
    </Story>
  );
};
