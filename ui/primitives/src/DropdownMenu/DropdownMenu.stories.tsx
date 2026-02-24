/**
 * DropdownMenu.stories.tsx
 * Dev reference for the DropdownMenu component system.
 */
import { useState } from 'react';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { Story, StoryItem, StoryRow, StorySection } from '../dev/Story';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownSubmenu,
  DropdownSubmenuContent,
  DropdownSubmenuTriggerItem,
} from './DropdownMenu';

export const DropdownMenuStories = () => {
  const [view, setView] = useState('grid');
  const [lastAction, setLastAction] = useState<string | null>(null);

  const action = (label: string) => () => setLastAction(label);

  return (
    <Story title="DropdownMenu">
      {/* --------------------------------------------------------
          BASIC
          Trigger uses the render prop — Base UI merges its
          keyboard/aria handlers directly onto the element.
          This is what fixes keyboard navigation vs the old
          children-as-render pattern.
      -------------------------------------------------------- */}
      <StorySection
        title="Basic"
        description="Trigger uses render prop so Base UI can attach keyboard handlers directly. Arrow keys navigate, Enter/Space select, Escape closes."
      >
        <StoryRow>
          <StoryItem label="button trigger">
            <DropdownMenu>
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
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <IconButton
                    variant="ghost"
                    icon="more-horizontal"
                    label="More options"
                  />
                }
              />
              <DropdownMenuPortal>
                <DropdownMenuPositioner
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuContent>
                    <DropdownMenuItem label="Edit" onClick={action('Edit')} />
                    <DropdownMenuItem
                      label="Duplicate"
                      onClick={action('Duplicate')}
                    />
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      label="Delete"
                      onClick={action('Delete')}
                    />
                  </DropdownMenuContent>
                </DropdownMenuPositioner>
              </DropdownMenuPortal>
            </DropdownMenu>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          LABELS + SEPARATORS
      -------------------------------------------------------- */}
      <StorySection
        title="Labels and separators"
        description="MenuLabel renders a section heading. MenuSeparator renders a visual divider."
      >
        <StoryRow>
          <StoryItem label="grouped">
            <DropdownMenu>
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
            </DropdownMenu>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          ICONS + KEYBOARD SHORTCUTS
      -------------------------------------------------------- */}
      <StorySection
        title="Icons and keyboard shortcuts"
        description="Pass icon and keyboardShortcut to DropdownMenuItem."
      >
        <StoryRow>
          <StoryItem label="with icons + shortcuts">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="outline">Edit</Button>}
              />
              <DropdownMenuPortal>
                <DropdownMenuPositioner
                  side="bottom"
                  align="start"
                  sideOffset={4}
                >
                  <DropdownMenuContent minWidth={200}>
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
                  </DropdownMenuContent>
                </DropdownMenuPositioner>
              </DropdownMenuPortal>
            </DropdownMenu>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          SHIFT KEY SECONDARY STATE
          Holding Shift changes the label, icon, and handler.
          Useful for destructive variants of actions.
      -------------------------------------------------------- */}
      <StorySection
        title="Shift secondary state"
        description="Hold Shift to reveal secondary labels, icons, and handlers. Useful for destructive variants."
      >
        <StoryRow>
          <StoryItem label="shift to delete">
            <DropdownMenu>
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
            </DropdownMenu>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          RADIO GROUP
      -------------------------------------------------------- */}
      <StorySection
        title="Radio group"
        description="RadioGroup manages a single selected value. RadioItem renders with a checkmark indicator when selected."
      >
        <StoryRow>
          <StoryItem label={`view: ${view}`}>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="outline">View</Button>}
              />
              <DropdownMenuPortal>
                <DropdownMenuPositioner
                  side="bottom"
                  align="start"
                  sideOffset={4}
                >
                  <DropdownMenuContent minWidth={160}>
                    <DropdownMenuGroup label="View as">
                      <DropdownMenuRadioGroup
                        value={view}
                        onValueChange={setView}
                      >
                        <DropdownMenuRadioItem value="list" label="List" />
                        <DropdownMenuRadioItem value="grid" label="Grid" />
                        <DropdownMenuRadioItem
                          value="columns"
                          label="Columns"
                        />
                      </DropdownMenuRadioGroup>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenuPositioner>
              </DropdownMenuPortal>
            </DropdownMenu>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          SUBMENU
      -------------------------------------------------------- */}
      <StorySection
        title="Submenu"
        description="DropdownSubmenu nests a full menu inside a trigger item. Keyboard navigation works across levels."
      >
        <StoryRow>
          <StoryItem label="with submenu">
            <DropdownMenu>
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
            </DropdownMenu>
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
            <DropdownMenu>
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
            </DropdownMenu>
          </StoryItem>
        </StoryRow>
      </StorySection>
    </Story>
  );
};
