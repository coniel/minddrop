/**
 * ContextMenu.stories.tsx
 * Dev reference for the ContextMenu component system.
 */
import { useState } from 'react';
import { ActionMenuItem as ContextMenuItem } from '../ActionMenuItem';
import { ActionMenuRadioItem as ContextMenuRadioItem } from '../ActionMenuItem';
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
import { ContextRadioSubmenu } from './ContextRadioSubmenu';
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
              <ContextMenuItem label="Cut" onSelect={action('Cut')} />
              <ContextMenuItem label="Copy" onSelect={action('Copy')} />
              <ContextMenuItem label="Paste" onSelect={action('Paste')} />
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
                  onSelect={action('Cut')}
                />
                <ContextMenuItem
                  label="Copy"
                  icon="copy"
                  onSelect={action('Copy')}
                />
                <ContextMenuItem
                  label="Paste"
                  icon="clipboard"
                  onSelect={action('Paste')}
                />
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuGroup label="View">
                <ContextMenuItem
                  label="Zoom in"
                  icon="zoom-in"
                  onSelect={action('Zoom in')}
                />
                <ContextMenuItem
                  label="Zoom out"
                  icon="zoom-out"
                  onSelect={action('Zoom out')}
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
                      onSelect={action('Archive')}
                      secondaryOnSelect={action('Delete')}
                    />
                    <ContextMenuItem
                      label="Move to..."
                      icon="folder"
                      onSelect={action('Move')}
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
        description="ContextSubmenu nests a full menu inside a trigger item. ContextRadioSubmenu is a convenience wrapper for radio selection submenus."
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
                    <ContextMenuItem label="Open" onSelect={action('Open')} />
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
                              onSelect={action('Preview')}
                            />
                            <ContextMenuItem
                              label="Editor"
                              onSelect={action('Editor')}
                            />
                            <ContextMenuItem
                              label="Browser"
                              onSelect={action('Browser')}
                            />
                          </ContextSubmenuContent>
                        </ContextMenuPositioner>
                      </ContextMenuPortal>
                    </ContextSubmenu>
                    <ContextMenuSeparator />
                    <ContextMenuItem
                      label="Move to trash"
                      icon="trash"
                      onSelect={action('Trash')}
                    />
                  </ContextMenuContent>
                </ContextMenuPositioner>
              </ContextMenuPortal>
            </ContextMenuRoot>
          </StoryItem>
          <StoryItem label="radio submenu">
            <ContextMenu trigger={<TriggerArea />} minWidth={200}>
              <ContextRadioSubmenu
                label="Layout"
                defaultValue="grid"
                items={[
                  { value: 'list', label: 'List' },
                  { value: 'grid', label: 'Grid' },
                  { value: 'columns', label: 'Columns' },
                ]}
              />
              <ContextRadioSubmenu
                label="Padding"
                icon="rows-3"
                defaultValue="comfortable"
                items={[
                  { value: 'compact', label: 'Compact', icon: 'rows-4' },
                  {
                    value: 'comfortable',
                    label: 'Comfortable',
                    icon: 'rows-3',
                  },
                  { value: 'spacious', label: 'Spacious', icon: 'rows-2' },
                ]}
              />
            </ContextMenu>
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
                    <ContextMenuItem label="Cut" onSelect={action('Cut')} />
                    <ContextMenuItem
                      label="Copy"
                      disabled
                      onSelect={action('Copy')}
                    />
                    <ContextMenuItem
                      label="Paste"
                      disabled
                      onSelect={action('Paste')}
                    />
                    <ContextMenuSeparator />
                    <ContextMenuItem
                      label="Select all"
                      onSelect={action('Select all')}
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
