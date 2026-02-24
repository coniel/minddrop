/**
 * Collapsible.stories.tsx
 * Dev reference for the Collapsible component.
 */
import { useState } from 'react';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { Group } from '../Layout/Group';
import { Stack } from '../Layout/Stack';
import { Text } from '../Text';
import { Story, StoryItem, StoryRow, StorySection } from '../dev/Story';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './Collapsible';

export const CollapsibleStories = () => {
  const [open, setOpen] = useState(false);

  return (
    <Story title="Collapsible">
      {/* --------------------------------------------------------
          BASIC
          Collapsible is a layout primitive with no built-in
          styling. The trigger can be any element. Content
          animates open/closed via Base UI's Panel.
      -------------------------------------------------------- */}
      <StorySection
        title="Basic"
        description="Collapsible is unstyled — compose any trigger and content. Base UI handles open/close state and animates the panel height."
      >
        <StoryRow>
          <StoryItem label="default">
            <div style={{ width: 280 }}>
              <Collapsible>
                <CollapsibleTrigger
                  render={<Button variant="outline">Toggle section</Button>}
                />
                <CollapsibleContent>
                  <div style={{ paddingTop: 'var(--space-3)' }}>
                    <Text size="sm" color="muted">
                      This content is revealed when the trigger is activated.
                      Base UI animates the panel height automatically.
                    </Text>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          CONTROLLED
      -------------------------------------------------------- */}
      <StorySection
        title="Controlled"
        description="Manage open state externally via open and onOpenChange."
      >
        <StoryRow>
          <StoryItem label={`open: ${open}`}>
            <div style={{ width: 280 }}>
              <Collapsible open={open} onOpenChange={setOpen}>
                <Group justify="between">
                  <Text size="sm" weight="medium">
                    Advanced options
                  </Text>
                  <CollapsibleTrigger
                    render={
                      <IconButton
                        variant="ghost"
                        size="sm"
                        icon={open ? 'chevron-up' : 'chevron-down'}
                        label={open ? 'Collapse' : 'Expand'}
                      />
                    }
                  />
                </Group>
                <CollapsibleContent>
                  <Stack gap={2} style={{ paddingTop: 'var(--space-3)' }}>
                    <Text size="sm" color="muted">
                      Option one
                    </Text>
                    <Text size="sm" color="muted">
                      Option two
                    </Text>
                    <Text size="sm" color="muted">
                      Option three
                    </Text>
                  </Stack>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          DEFAULT OPEN
      -------------------------------------------------------- */}
      <StorySection
        title="Default open"
        description="Use defaultOpen for uncontrolled usage that starts expanded."
      >
        <StoryRow>
          <StoryItem label="defaultOpen">
            <div style={{ width: 280 }}>
              <Collapsible defaultOpen>
                <CollapsibleTrigger
                  render={<Button variant="ghost">Hide details</Button>}
                />
                <CollapsibleContent>
                  <div style={{ paddingTop: 'var(--space-3)' }}>
                    <Text size="sm" color="muted">
                      This panel starts open. Click the trigger to collapse it.
                    </Text>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          IN USE
          Common real-world pattern — sidebar section with a
          label trigger and chevron icon.
      -------------------------------------------------------- */}
      <StorySection
        title="In use"
        description="Sidebar section pattern — label acts as the trigger with a rotating chevron."
      >
        <StoryRow>
          <StoryItem label="sidebar section">
            <div
              style={{
                width: 240,
                background: 'var(--surface-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-2)',
              }}
            >
              <Collapsible defaultOpen>
                <CollapsibleTrigger
                  render={
                    <button
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'none',
                        border: 'none',
                        padding: 'var(--space-1) var(--space-2)',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'default',
                      }}
                    >
                      <Text size="xs" weight="semibold" color="subtle">
                        PROJECTS
                      </Text>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{
                          color: 'var(--text-subtle)',
                          transition: 'transform var(--duration-normal)',
                        }}
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                  }
                />
                <CollapsibleContent>
                  <Stack gap={1} style={{ paddingTop: 'var(--space-1)' }}>
                    <Button variant="ghost" justify="start" size="md">
                      Alpha
                    </Button>
                    <Button variant="subtle" justify="start" size="md">
                      Beta
                    </Button>
                    <Button variant="ghost" justify="start" size="md">
                      Gamma
                    </Button>
                  </Stack>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </StoryItem>
        </StoryRow>
      </StorySection>
    </Story>
  );
};
