/**
 * DropdownMenu.stories.tsx
 * Dev reference for the DropdownMenu component system.
 */
import { useState } from 'react';
import { ActionMenuItem as DropdownMenuItem } from '../ActionMenuItem';
import { ActionMenuRadioItem as DropdownMenuRadioItem } from '../ActionMenuItem';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { SearchableMenuItem as DropdownSearchableMenuItem } from '../SearchableMenu';
import { Story, StoryItem, StoryRow, StorySection } from '../dev/Story';
import { DropdownMenu } from './DropdownMenu';
import { DropdownMenuContent } from './DropdownMenuContent';
import { DropdownMenuGroup } from './DropdownMenuGroup';
import { DropdownMenuLabel } from './DropdownMenuLabel';
import { DropdownMenuPortal } from './DropdownMenuPortal';
import { DropdownMenuPositioner } from './DropdownMenuPositioner';
import { DropdownMenuRadioGroup } from './DropdownMenuRadioGroup';
import { DropdownMenuRoot } from './DropdownMenuRoot';
import { DropdownMenuSeparator } from './DropdownMenuSeparator';
import { DropdownMenuTrigger } from './DropdownMenuTrigger';
import { DropdownRadioSubmenu } from './DropdownRadioSubmenu';
import { DropdownSubmenu } from './DropdownSubmenu';
import { DropdownSubmenuContent } from './DropdownSubmenuContent';
import { DropdownSubmenuTriggerItem } from './DropdownSubmenuTriggerItem';

export const DropdownMenuStories = () => {
  const [view, setView] = useState('grid');
  const [lastAction, setLastAction] = useState<string | null>(null);

  const action = (label: string) => () => setLastAction(label);

  return (
    <Story title="DropdownMenu">
      {/* --------------------------------------------------------
          CONVENIENCE API
          The simplified DropdownMenu wraps Root, Trigger, Portal,
          Positioner, and Content into a single component.
      -------------------------------------------------------- */}
      <StorySection
        title="Convenience API"
        description="Pass a trigger element and menu items as children. Handles Root, Trigger, Portal, Positioner, and Content internally."
      >
        <StoryRow>
          <StoryItem label="button trigger">
            <DropdownMenu
              trigger={<Button variant="outline">Open menu</Button>}
            >
              <DropdownMenuItem
                label="New file"
                onSelect={action('New file')}
              />
              <DropdownMenuItem label="Open..." onSelect={action('Open')} />
              <DropdownMenuSeparator />
              <DropdownMenuItem label="Save" onSelect={action('Save')} />
              <DropdownMenuItem
                label="Save as..."
                onSelect={action('Save as')}
              />
            </DropdownMenu>
            {lastAction && (
              <span
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-muted)',
                }}
              >
                → {lastAction}
              </span>
            )}
          </StoryItem>
          <StoryItem label="icon button trigger">
            <DropdownMenu
              trigger={
                <IconButton
                  variant="ghost"
                  icon="more-horizontal"
                  label="More options"
                />
              }
              align="end"
            >
              <DropdownMenuItem label="Edit" onSelect={action('Edit')} />
              <DropdownMenuItem
                label="Duplicate"
                onSelect={action('Duplicate')}
              />
              <DropdownMenuSeparator />
              <DropdownMenuItem label="Delete" onSelect={action('Delete')} />
            </DropdownMenu>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          CONVENIENCE API — ICONS + SHORTCUTS
      -------------------------------------------------------- */}
      <StorySection
        title="Convenience — icons and shortcuts"
        description="Pass icon and keyboardShortcut to DropdownMenuItem. Works the same as the compositional API."
      >
        <StoryRow>
          <StoryItem label="with icons + shortcuts">
            <DropdownMenu
              trigger={<Button variant="outline">Edit</Button>}
              minWidth={200}
            >
              <DropdownMenuItem
                label="Undo"
                icon="rotate-ccw"
                keyboardShortcut={['Mod', 'Z']}
                onSelect={action('Undo')}
              />
              <DropdownMenuItem
                label="Redo"
                icon="rotate-cw"
                keyboardShortcut={['Mod', 'Shift', 'Z']}
                onSelect={action('Redo')}
              />
              <DropdownMenuSeparator />
              <DropdownMenuItem
                label="Cut"
                icon="scissors"
                keyboardShortcut={['Mod', 'X']}
                onSelect={action('Cut')}
              />
              <DropdownMenuItem
                label="Copy"
                icon="copy"
                keyboardShortcut={['Mod', 'C']}
                onSelect={action('Copy')}
              />
              <DropdownMenuItem
                label="Paste"
                icon="clipboard"
                keyboardShortcut={['Mod', 'V']}
                onSelect={action('Paste')}
              />
            </DropdownMenu>
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
            <DropdownMenu
              trigger={<Button variant="outline">View</Button>}
              minWidth={160}
            >
              <DropdownMenuGroup label="View as">
                <DropdownMenuRadioGroup value={view} onValueChange={setView}>
                  <DropdownMenuRadioItem value="list" label="List" />
                  <DropdownMenuRadioItem value="grid" label="Grid" />
                  <DropdownMenuRadioItem value="columns" label="Columns" />
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenu>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          SEARCHABLE
          Menus with a search field that filters items by label.
      -------------------------------------------------------- */}
      <StorySection
        title="Searchable"
        description="Pass searchable to enable a search field that filters items by label. Lists exceeding 50 items are automatically virtualized."
      >
        <StoryRow>
          <StoryItem label="databases">
            <DropdownMenu
              trigger={<Button variant="outline">Select database</Button>}
              searchable
              searchPlaceholder="Search databases..."
              minWidth={220}
            >
              <DropdownSearchableMenuItem
                label="Tasks"
                icon="check-square"
                onSelect={action('Tasks')}
              />
              <DropdownSearchableMenuItem
                label="Projects"
                icon="folder"
                onSelect={action('Projects')}
              />
              <DropdownSearchableMenuItem
                label="Notes"
                icon="file-text"
                onSelect={action('Notes')}
              />
              <DropdownSearchableMenuItem
                label="Bookmarks"
                icon="bookmark"
                onSelect={action('Bookmarks')}
              />
              <DropdownSearchableMenuItem
                label="Contacts"
                icon="users"
                onSelect={action('Contacts')}
              />
              <DropdownSearchableMenuItem
                label="Meetings"
                icon="calendar"
                onSelect={action('Meetings')}
              />
              <DropdownSearchableMenuItem
                label="Recipes"
                icon="chef-hat"
                onSelect={action('Recipes')}
              />
              <DropdownSearchableMenuItem
                label="Reading list"
                icon="book-open"
                onSelect={action('Reading list')}
              />
            </DropdownMenu>
          </StoryItem>
          <StoryItem label="grouped settings">
            <DropdownMenu
              trigger={<Button variant="outline">Settings</Button>}
              searchable
              searchPlaceholder="Search settings..."
              minWidth={220}
            >
              <DropdownMenuGroup label="Appearance">
                <DropdownSearchableMenuItem
                  label="Theme"
                  icon="palette"
                  onSelect={action('Theme')}
                />
                <DropdownSearchableMenuItem
                  label="Font size"
                  icon="type"
                  onSelect={action('Font size')}
                />
                <DropdownSearchableMenuItem
                  label="Layout"
                  icon="layout"
                  onSelect={action('Layout')}
                />
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup label="Privacy">
                <DropdownSearchableMenuItem
                  label="Cookies"
                  icon="cookie"
                  onSelect={action('Cookies')}
                />
                <DropdownSearchableMenuItem
                  label="Tracking"
                  icon="eye-off"
                  onSelect={action('Tracking')}
                />
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup label="Advanced">
                <DropdownSearchableMenuItem
                  label="Developer tools"
                  icon="terminal"
                  onSelect={action('Developer tools')}
                />
                <DropdownSearchableMenuItem
                  label="Keyboard shortcuts"
                  icon="keyboard"
                  onSelect={action('Keyboard shortcuts')}
                />
                <DropdownSearchableMenuItem
                  label="Notifications"
                  icon="bell"
                  onSelect={action('Notifications')}
                />
              </DropdownMenuGroup>
            </DropdownMenu>
          </StoryItem>
          <StoryItem label="virtualized (100 items)">
            <DropdownMenu
              trigger={<Button variant="outline">Select entry</Button>}
              searchable
              searchPlaceholder="Search entries..."
              minWidth={240}
            >
              {Array.from({ length: 100 }, (_, index) => (
                <DropdownSearchableMenuItem
                  key={index}
                  label={`Entry ${index + 1}`}
                  icon="file"
                  onSelect={action(`Entry ${index + 1}`)}
                />
              ))}
            </DropdownMenu>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          COMPOSITIONAL API — BASIC
          Uses DropdownMenuRoot for full control over structure.
      -------------------------------------------------------- */}
      <StorySection
        title="Compositional API — basic"
        description="Use DropdownMenuRoot + individual parts for advanced layouts like submenus, custom portals, or nested structures."
      >
        <StoryRow>
          <StoryItem label="button trigger">
            <DropdownMenuRoot>
              <DropdownMenuTrigger
                render={<Button variant="outline">Open menu</Button>}
              />
              <DropdownMenuPortal>
                <DropdownMenuPositioner
                  side="bottom"
                  align="start"
                  sideOffset={4}
                >
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      label="New file"
                      onSelect={action('New file')}
                    />
                    <DropdownMenuItem
                      label="Open..."
                      onSelect={action('Open')}
                    />
                    <DropdownMenuSeparator />
                    <DropdownMenuItem label="Save" onSelect={action('Save')} />
                    <DropdownMenuItem
                      label="Save as..."
                      onSelect={action('Save as')}
                    />
                  </DropdownMenuContent>
                </DropdownMenuPositioner>
              </DropdownMenuPortal>
            </DropdownMenuRoot>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          COMPOSITIONAL API — LABELS + SEPARATORS
      -------------------------------------------------------- */}
      <StorySection
        title="Compositional — labels and separators"
        description="MenuLabel renders a section heading. MenuSeparator renders a visual divider."
      >
        <StoryRow>
          <StoryItem label="grouped">
            <DropdownMenuRoot>
              <DropdownMenuTrigger
                render={<Button variant="outline">Open</Button>}
              />
              <DropdownMenuPortal>
                <DropdownMenuPositioner
                  side="bottom"
                  align="start"
                  sideOffset={4}
                >
                  <DropdownMenuContent minWidth={180}>
                    <DropdownMenuGroup label="File">
                      <DropdownMenuItem label="New" onSelect={action('New')} />
                      <DropdownMenuItem
                        label="Open"
                        onSelect={action('Open')}
                      />
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup label="Edit">
                      <DropdownMenuItem label="Cut" onSelect={action('Cut')} />
                      <DropdownMenuItem
                        label="Copy"
                        onSelect={action('Copy')}
                      />
                      <DropdownMenuItem
                        label="Paste"
                        onSelect={action('Paste')}
                      />
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenuPositioner>
              </DropdownMenuPortal>
            </DropdownMenuRoot>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          COMPOSITIONAL API — SHIFT KEY SECONDARY STATE
      -------------------------------------------------------- */}
      <StorySection
        title="Compositional — shift secondary state"
        description="Hold Shift to reveal secondary labels, icons, and handlers. Useful for destructive variants."
      >
        <StoryRow>
          <StoryItem label="shift to delete">
            <DropdownMenuRoot>
              <DropdownMenuTrigger
                render={<Button variant="outline">Actions</Button>}
              />
              <DropdownMenuPortal>
                <DropdownMenuPositioner
                  side="bottom"
                  align="start"
                  sideOffset={4}
                >
                  <DropdownMenuContent minWidth={200}>
                    <DropdownMenuItem
                      label="Archive item"
                      icon="archive"
                      secondaryLabel="Delete item"
                      secondaryIcon="trash"
                      onSelect={action('Archive')}
                      secondaryOnSelect={action('Delete')}
                    />
                    <DropdownMenuItem
                      label="Move to..."
                      icon="folder"
                      onSelect={action('Move')}
                    />
                  </DropdownMenuContent>
                </DropdownMenuPositioner>
              </DropdownMenuPortal>
            </DropdownMenuRoot>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          COMPOSITIONAL API — SUBMENU
      -------------------------------------------------------- */}
      <StorySection
        title="Compositional — submenu"
        description="DropdownSubmenu nests a full menu inside a trigger item. Requires the compositional API. DropdownRadioSubmenu is a convenience wrapper for radio selection submenus."
      >
        <StoryRow>
          <StoryItem label="with submenu">
            <DropdownMenuRoot>
              <DropdownMenuTrigger
                render={<Button variant="outline">File</Button>}
              />
              <DropdownMenuPortal>
                <DropdownMenuPositioner
                  side="bottom"
                  align="start"
                  sideOffset={4}
                >
                  <DropdownMenuContent minWidth={180}>
                    <DropdownMenuItem
                      label="New file"
                      onSelect={action('New file')}
                    />
                    <DropdownSubmenu>
                      <DropdownSubmenuTriggerItem
                        label="Open recent"
                        icon="clock"
                      />
                      <DropdownMenuPortal>
                        <DropdownMenuPositioner
                          side="right"
                          align="start"
                          sideOffset={4}
                        >
                          <DropdownSubmenuContent minWidth={180}>
                            <DropdownMenuItem
                              label="project-alpha.md"
                              onSelect={action('Open alpha')}
                            />
                            <DropdownMenuItem
                              label="notes.md"
                              onSelect={action('Open notes')}
                            />
                            <DropdownMenuItem
                              label="readme.md"
                              onSelect={action('Open readme')}
                            />
                          </DropdownSubmenuContent>
                        </DropdownMenuPositioner>
                      </DropdownMenuPortal>
                    </DropdownSubmenu>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem label="Save" onSelect={action('Save')} />
                  </DropdownMenuContent>
                </DropdownMenuPositioner>
              </DropdownMenuPortal>
            </DropdownMenuRoot>
          </StoryItem>
          <StoryItem label="radio submenu">
            <DropdownMenu trigger={<Button variant="outline">Options</Button>}>
              <DropdownRadioSubmenu
                label="Layout"
                defaultValue="grid"
                items={[
                  { value: 'list', label: 'List' },
                  { value: 'grid', label: 'Grid' },
                  { value: 'columns', label: 'Columns' },
                ]}
              />
              <DropdownRadioSubmenu
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
            </DropdownMenu>
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
            <DropdownMenuRoot>
              <DropdownMenuTrigger
                render={<Button variant="outline">Open</Button>}
              />
              <DropdownMenuPortal>
                <DropdownMenuPositioner
                  side="bottom"
                  align="start"
                  sideOffset={4}
                >
                  <DropdownMenuContent minWidth={160}>
                    <DropdownMenuItem label="Cut" onSelect={action('Cut')} />
                    <DropdownMenuItem
                      label="Copy"
                      disabled
                      onSelect={action('Copy')}
                    />
                    <DropdownMenuItem
                      label="Paste"
                      disabled
                      onSelect={action('Paste')}
                    />
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      label="Select all"
                      onSelect={action('Select all')}
                    />
                  </DropdownMenuContent>
                </DropdownMenuPositioner>
              </DropdownMenuPortal>
            </DropdownMenuRoot>
          </StoryItem>
        </StoryRow>
      </StorySection>
    </Story>
  );
};
