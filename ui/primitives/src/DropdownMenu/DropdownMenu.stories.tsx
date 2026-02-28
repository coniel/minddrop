/**
 * DropdownMenu.stories.tsx
 * Dev reference for the DropdownMenu component system.
 */
import { useState } from 'react';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { MenuItemRenderer as DropdownMenuItem } from '../MenuItemRenderer';
import { RadioMenuItemRenderer as DropdownMenuRadioItem } from '../MenuItemRenderer';
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
              <DropdownMenuItem label="New file" onClick={action('New file')} />
              <DropdownMenuItem label="Open..." onClick={action('Open')} />
              <DropdownMenuSeparator />
              <DropdownMenuItem label="Save" onClick={action('Save')} />
              <DropdownMenuItem
                label="Save as..."
                onClick={action('Save as')}
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
              <DropdownMenuItem label="Edit" onClick={action('Edit')} />
              <DropdownMenuItem
                label="Duplicate"
                onClick={action('Duplicate')}
              />
              <DropdownMenuSeparator />
              <DropdownMenuItem label="Delete" onClick={action('Delete')} />
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
                onClick={action('Undo')}
              />
              <DropdownMenuItem
                label="Redo"
                icon="rotate-cw"
                keyboardShortcut={['Mod', 'Shift', 'Z']}
                onClick={action('Redo')}
              />
              <DropdownMenuSeparator />
              <DropdownMenuItem
                label="Cut"
                icon="scissors"
                keyboardShortcut={['Mod', 'X']}
                onClick={action('Cut')}
              />
              <DropdownMenuItem
                label="Copy"
                icon="copy"
                keyboardShortcut={['Mod', 'C']}
                onClick={action('Copy')}
              />
              <DropdownMenuItem
                label="Paste"
                icon="clipboard"
                keyboardShortcut={['Mod', 'V']}
                onClick={action('Paste')}
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
                      onClick={action('New file')}
                    />
                    <DropdownMenuItem
                      label="Open..."
                      onClick={action('Open')}
                    />
                    <DropdownMenuSeparator />
                    <DropdownMenuItem label="Save" onClick={action('Save')} />
                    <DropdownMenuItem
                      label="Save as..."
                      onClick={action('Save as')}
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
                      <DropdownMenuItem label="New" onClick={action('New')} />
                      <DropdownMenuItem label="Open" onClick={action('Open')} />
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup label="Edit">
                      <DropdownMenuItem label="Cut" onClick={action('Cut')} />
                      <DropdownMenuItem label="Copy" onClick={action('Copy')} />
                      <DropdownMenuItem
                        label="Paste"
                        onClick={action('Paste')}
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
                      onClick={action('Archive')}
                      secondaryOnClick={action('Delete')}
                    />
                    <DropdownMenuItem
                      label="Move to..."
                      icon="folder"
                      onClick={action('Move')}
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
        description="DropdownSubmenu nests a full menu inside a trigger item. Requires the compositional API."
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
                      onClick={action('New file')}
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
                              onClick={action('Open alpha')}
                            />
                            <DropdownMenuItem
                              label="notes.md"
                              onClick={action('Open notes')}
                            />
                            <DropdownMenuItem
                              label="readme.md"
                              onClick={action('Open readme')}
                            />
                          </DropdownSubmenuContent>
                        </DropdownMenuPositioner>
                      </DropdownMenuPortal>
                    </DropdownSubmenu>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem label="Save" onClick={action('Save')} />
                  </DropdownMenuContent>
                </DropdownMenuPositioner>
              </DropdownMenuPortal>
            </DropdownMenuRoot>
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
                    <DropdownMenuItem label="Cut" onClick={action('Cut')} />
                    <DropdownMenuItem
                      label="Copy"
                      disabled
                      onClick={action('Copy')}
                    />
                    <DropdownMenuItem
                      label="Paste"
                      disabled
                      onClick={action('Paste')}
                    />
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      label="Select all"
                      onClick={action('Select all')}
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
