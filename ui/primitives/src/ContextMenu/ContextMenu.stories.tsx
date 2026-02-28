/**
 * ContextMenu.stories.tsx
 * Dev reference for the ContextMenu component system.
 */
import { useState } from 'react';
import { MenuItemRenderer as ContextMenuItem } from '../MenuItemRenderer';
import { RadioMenuItemRenderer as ContextMenuRadioItem } from '../MenuItemRenderer';
import { Text } from '../Text';
import { Story, StoryItem, StoryRow, StorySection } from '../dev/Story';
import { ContextMenu } from './ContextMenu';
import { ContextMenuContent } from './ContextMenuContent';
import { ContextMenuGroup } from './ContextMenuGroup';
import { ContextMenuPortal } from './ContextMenuPortal';
import { ContextMenuPositioner } from './ContextMenuPositioner';
import { ContextMenuRadioGroup } from './ContextMenuRadioGroup';
import { ContextMenuRoot } from './ContextMenuRoot';
import { ContextMenuSeparator } from './ContextMenuSeparator';
import { ContextMenuTrigger } from './ContextMenuTrigger';
import { ContextSubmenu } from './ContextSubmenu';
import { ContextSubmenuContent } from './ContextSubmenuContent';
import { ContextSubmenuTriggerItem } from './ContextSubmenuTriggerItem';

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
          CONVENIENCE API
          The simplified ContextMenu wraps Root, Trigger, Portal,
          Positioner, and Content into a single component.
      -------------------------------------------------------- */}
      <StorySection
        title="Convenience API"
        description="Pass a trigger region and menu items as children. Handles Root, Trigger, Portal, Positioner, and Content internally."
      >
        <StoryRow>
          <StoryItem label="basic">
            <ContextMenu trigger={<TriggerArea />} minWidth={180}>
              <ContextMenuItem label="Cut" onClick={action('Cut')} />
              <ContextMenuItem label="Copy" onClick={action('Copy')} />
              <ContextMenuItem label="Paste" onClick={action('Paste')} />
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
          CONVENIENCE API — ICONS
      -------------------------------------------------------- */}
      <StorySection
        title="Convenience — icons"
        description="Pass icon to ContextMenuItem. Works the same as the compositional API."
      >
        <StoryRow>
          <StoryItem label="with icons">
            <ContextMenu trigger={<TriggerArea />} minWidth={200}>
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
            </ContextMenu>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          CONVENIENCE API — RADIO GROUP
      -------------------------------------------------------- */}
      <StorySection
        title="Convenience — radio group"
        description="Radio groups work inside the convenience wrapper."
      >
        <StoryRow>
          <StoryItem label={`view: ${view}`}>
            <ContextMenu trigger={<TriggerArea />} minWidth={160}>
              <ContextMenuGroup label="View as">
                <ContextMenuRadioGroup value={view} onValueChange={setView}>
                  <ContextMenuRadioItem value="list" label="List" />
                  <ContextMenuRadioItem value="grid" label="Grid" />
                  <ContextMenuRadioItem value="columns" label="Columns" />
                </ContextMenuRadioGroup>
              </ContextMenuGroup>
            </ContextMenu>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          COMPOSITIONAL API — SHIFT KEY SECONDARY STATE
      -------------------------------------------------------- */}
      <StorySection
        title="Compositional — shift secondary state"
        description="Hold Shift to reveal secondary labels, icons, and handlers. Uses ContextMenuRoot for full control."
      >
        <StoryRow>
          <StoryItem label="shift to delete">
            <ContextMenuRoot>
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
            </ContextMenuRoot>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          COMPOSITIONAL API — SUBMENU
      -------------------------------------------------------- */}
      <StorySection
        title="Compositional — submenu"
        description="ContextSubmenu nests a full menu inside a trigger item. Requires the compositional API."
      >
        <StoryRow>
          <StoryItem label="with submenu">
            <ContextMenuRoot>
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
            </ContextMenuRoot>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          COMPOSITIONAL API — DISABLED ITEMS
      -------------------------------------------------------- */}
      <StorySection
        title="Compositional — disabled items"
        description="Disabled items are skipped during keyboard navigation."
      >
        <StoryRow>
          <StoryItem label="with disabled">
            <ContextMenuRoot>
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
            </ContextMenuRoot>
          </StoryItem>
        </StoryRow>
      </StorySection>
    </Story>
  );
};
