/**
 * FloatingToolbar.stories.tsx
 * Dev reference for the FloatingToolbar component.
 */
import { registerStory } from '@minddrop/dev-tools';
import { Text } from '../Text';
import { ToolbarIconButton, ToolbarSeparator } from '../Toolbar';
import { Story, StoryItem, StoryRow, StorySection } from '../dev/Story';
import { FloatingToolbar } from './FloatingToolbar';

export const FloatingToolbarStories = () => (
  <Story title="FloatingToolbar">
    {/* --------------------------------------------------------
        SIZES
        The surface only - placement is left to the consumer.
        Use lg for a view's primary toolbar and md for secondary
        toolbars such as canvas zoom controls.
    -------------------------------------------------------- */}
    <StorySection
      title="Sizes"
      description="The floating surface without any positioning. Use lg for a view's primary toolbar, md for secondary toolbars such as zoom controls, and sm for compact toolbars attached to a single element."
    >
      <StoryRow>
        <StoryItem label="lg (default)">
          <FloatingToolbar visible>
            <ToolbarIconButton size="lg" icon="plus" stringLabel="Add" />
            <ToolbarIconButton size="lg" icon="search" stringLabel="Search" />
          </FloatingToolbar>
        </StoryItem>
        <StoryItem label="md">
          <FloatingToolbar visible size="md">
            <ToolbarIconButton icon="zoom-out" stringLabel="Zoom out" />
            <ToolbarIconButton icon="zoom-in" stringLabel="Zoom in" />
          </FloatingToolbar>
        </StoryItem>
        <StoryItem label="sm">
          <FloatingToolbar visible size="sm">
            <ToolbarIconButton size="sm" icon="pencil" stringLabel="Edit" />
            <ToolbarIconButton size="sm" icon="copy" stringLabel="Duplicate" />
          </FloatingToolbar>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        HOVER REVEAL
        Hidden until the host is hovered. Hosts opt in by adding
        the floating-toolbar-host class.
    -------------------------------------------------------- */}
    <StorySection
      title="Hover reveal"
      description="Without the visible prop, the toolbar is revealed while its host is hovered. The host must carry the floating-toolbar-host class."
    >
      <StoryRow>
        <StoryItem label="hover the panel">
          <div
            className="floating-toolbar-host"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              width: 320,
              height: 140,
              padding: 'var(--space-3)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <FloatingToolbar>
              <ToolbarIconButton size="lg" icon="plus" stringLabel="Add" />
              <ToolbarIconButton size="lg" icon="search" stringLabel="Search" />
            </FloatingToolbar>
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        CONTENT
        Any toolbar content works. Selection toolbars pair a
        count with the actions applied to the selection.
    -------------------------------------------------------- */}
    <StorySection
      title="Content"
      description="Any Toolbar content works, including text alongside the actions."
    >
      <StoryRow>
        <StoryItem label="selection actions">
          <FloatingToolbar visible>
            <Text size="sm" color="muted" stringText="3 selected" />
            <ToolbarSeparator />
            <ToolbarIconButton
              size="lg"
              icon="trash-2"
              danger="on-hover"
              stringLabel="Delete"
            />
            <ToolbarIconButton size="lg" icon="x" stringLabel="Clear" />
          </FloatingToolbar>
        </StoryItem>
      </StoryRow>
    </StorySection>
  </Story>
);

registerStory({
  group: 'Layout',
  label: 'FloatingToolbar',
  component: FloatingToolbarStories,
});
