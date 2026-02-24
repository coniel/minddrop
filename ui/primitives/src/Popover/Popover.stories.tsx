/**
 * Popover.stories.tsx
 * Dev reference for the Popover component.
 */
import { useState } from 'react';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { Group } from '../Layout/Group';
import { Stack } from '../Layout/Stack';
import { Text } from '../Text';
import { Story, StoryItem, StoryRow, StorySection } from '../dev/Story';
import { TextField } from '../fields/TextField';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  PopoverTrigger,
} from './Popover';

export const PopoverStories = () => (
  <Story title="Popover">
    {/* --------------------------------------------------------
        BASIC
        Popover is a low-level primitive — it provides no
        internal padding or layout. Compose content freely inside
        PopoverContent.
    -------------------------------------------------------- */}
    <StorySection
      title="Basic"
      description="Popover is a layout primitive with no internal padding. Compose content freely inside PopoverContent."
    >
      <StoryRow>
        <StoryItem label="simple">
          <Popover>
            <PopoverTrigger
              render={<Button variant="outline">Open popover</Button>}
            />
            <PopoverPortal>
              <PopoverPositioner side="bottom" align="start" sideOffset={4}>
                <PopoverContent
                  style={{ padding: 'var(--space-3)', width: 200 }}
                >
                  <Text size="sm">
                    This is a basic popover. Add any content here.
                  </Text>
                </PopoverContent>
              </PopoverPositioner>
            </PopoverPortal>
          </Popover>
        </StoryItem>
        <StoryItem label="with close button">
          <Popover>
            <PopoverTrigger
              render={<Button variant="outline">Open popover</Button>}
            />
            <PopoverPortal>
              <PopoverPositioner side="bottom" align="start" sideOffset={4}>
                <PopoverContent
                  style={{ padding: 'var(--space-3)', width: 220 }}
                >
                  <Stack gap={3}>
                    <Group justify="between">
                      <Text size="sm" weight="semibold">
                        Settings
                      </Text>
                      <PopoverClose
                        render={
                          <IconButton
                            variant="ghost"
                            size="sm"
                            icon="x"
                            label="Close"
                          />
                        }
                      />
                    </Group>
                    <Text size="sm" color="muted">
                      Adjust your preferences here.
                    </Text>
                  </Stack>
                </PopoverContent>
              </PopoverPositioner>
            </PopoverPortal>
          </Popover>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        PLACEMENT
        side and align props on PopoverPositioner control where
        the popup appears relative to the trigger.
    -------------------------------------------------------- */}
    <StorySection
      title="Placement"
      description="side and align on PopoverPositioner control placement. The popup automatically flips to stay in viewport."
    >
      <StoryRow>
        {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
          <StoryItem key={side} label={`side="${side}"`}>
            <Popover>
              <PopoverTrigger
                render={<Button variant="outline">{side}</Button>}
              />
              <PopoverPortal>
                <PopoverPositioner side={side} align="center" sideOffset={4}>
                  <PopoverContent
                    style={{ padding: 'var(--space-2) var(--space-3)' }}
                  >
                    <Text size="sm">Placed on {side}</Text>
                  </PopoverContent>
                </PopoverPositioner>
              </PopoverPortal>
            </Popover>
          </StoryItem>
        ))}
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        MIN WIDTH
        minWidth on PopoverContent sets a minimum width.
        Useful for dropdowns that should be at least as wide
        as their trigger.
    -------------------------------------------------------- */}
    <StorySection
      title="Min width"
      description="Pass minWidth to PopoverContent to set a minimum width. Useful when the trigger width is variable."
    >
      <StoryRow>
        <StoryItem label="minWidth={280}">
          <Popover>
            <PopoverTrigger
              render={<Button variant="outline">Short label</Button>}
            />
            <PopoverPortal>
              <PopoverPositioner side="bottom" align="start" sideOffset={4}>
                <PopoverContent
                  minWidth={280}
                  style={{ padding: 'var(--space-3)' }}
                >
                  <Text size="sm">This popover is at least 280px wide.</Text>
                </PopoverContent>
              </PopoverPositioner>
            </PopoverPortal>
          </Popover>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        COMPOSED CONTENT
        Popovers are layout-agnostic. Use Stack, Group,
        TextField etc. to build rich popup UIs.
    -------------------------------------------------------- */}
    <StorySection
      title="Composed content"
      description="Compose Stack, Group, TextField, and other primitives freely inside PopoverContent."
    >
      <StoryRow>
        <StoryItem label="inline form">
          <Popover>
            <PopoverTrigger
              render={<Button variant="outline">Edit name</Button>}
            />
            <PopoverPortal>
              <PopoverPositioner side="bottom" align="start" sideOffset={4}>
                <PopoverContent
                  style={{ padding: 'var(--space-3)', width: 260 }}
                >
                  <Stack gap={3}>
                    <TextField
                      label="Display name"
                      placeholder="Enter name..."
                      size="md"
                      variant="outline"
                    />
                    <Group justify="end" gap={2}>
                      <PopoverClose
                        render={
                          <Button variant="ghost" size="md">
                            Cancel
                          </Button>
                        }
                      />
                      <PopoverClose
                        render={
                          <Button variant="filled" size="md">
                            Save
                          </Button>
                        }
                      />
                    </Group>
                  </Stack>
                </PopoverContent>
              </PopoverPositioner>
            </PopoverPortal>
          </Popover>
        </StoryItem>
        <StoryItem label="icon button trigger">
          <Popover>
            <PopoverTrigger
              render={
                <IconButton
                  variant="ghost"
                  icon="more-horizontal"
                  label="More options"
                />
              }
            />
            <PopoverPortal>
              <PopoverPositioner side="bottom" align="end" sideOffset={4}>
                <PopoverContent
                  style={{ padding: 'var(--space-2)', width: 180 }}
                >
                  <Stack gap={1}>
                    {['Rename', 'Duplicate', 'Move to', 'Delete'].map(
                      (action) => (
                        <Button key={action} variant="ghost" size="md">
                          {action}
                        </Button>
                      ),
                    )}
                  </Stack>
                </PopoverContent>
              </PopoverPositioner>
            </PopoverPortal>
          </Popover>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        CONTROLLED
        Open state can be managed externally via open +
        onOpenChange for cases where you need to open/close
        the popover programmatically.
    -------------------------------------------------------- */}
    <StorySection
      title="Controlled"
      description="Manage open state externally via open and onOpenChange for programmatic control."
    >
      <StoryRow>
        <StoryItem label="controlled">
          {(() => {
            const [open, setOpen] = useState(false);
            return (
              <Group gap={2}>
                <Button variant="outline" onClick={() => setOpen(true)}>
                  Open
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  disabled={!open}
                >
                  Close
                </Button>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger render={<span />} />
                  <PopoverPortal>
                    <PopoverPositioner
                      side="bottom"
                      align="start"
                      sideOffset={4}
                    >
                      <PopoverContent
                        style={{ padding: 'var(--space-3)', width: 200 }}
                      >
                        <Text size="sm">Opened programmatically.</Text>
                      </PopoverContent>
                    </PopoverPositioner>
                  </PopoverPortal>
                </Popover>
              </Group>
            );
          })()}
        </StoryItem>
      </StoryRow>
    </StorySection>
  </Story>
);
