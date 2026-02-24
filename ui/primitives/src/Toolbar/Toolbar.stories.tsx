/**
 * Toolbar.stories.tsx
 * Dev reference for the Toolbar component.
 */

import {
  Toolbar,
  ToolbarButton,
  ToolbarIconButton,
  ToolbarSeparator,
} from './Toolbar';
import { Select } from '../Select';
import { Story, StorySection, StoryRow, StoryItem } from '../dev/Story';

export const ToolbarStories = () => (
  <Story title="Toolbar">

    {/* --------------------------------------------------------
        BASIC
        Built on Base UI Toolbar for accessible keyboard nav.
        Arrow keys move focus between items, Tab exits the toolbar.
        Always use Toolbar* components as children — plain buttons
        won't participate in keyboard navigation.
    -------------------------------------------------------- */}
    <StorySection title="Basic" description="Arrow keys navigate between items, Tab exits. Always use ToolbarButton and ToolbarIconButton — plain buttons won't participate in keyboard navigation.">
      <StoryRow>
        <StoryItem label="icon buttons">
          <Toolbar>
            <ToolbarIconButton variant="ghost" icon="bold" label="Bold" />
            <ToolbarIconButton variant="ghost" icon="italic" label="Italic" />
            <ToolbarIconButton variant="ghost" icon="underline" label="Underline" />
          </Toolbar>
        </StoryItem>
        <StoryItem label="buttons">
          <Toolbar>
            <ToolbarButton variant="filled">Cut</ToolbarButton>
            <ToolbarButton variant="filled">Copy</ToolbarButton>
            <ToolbarButton variant="filled">Paste</ToolbarButton>
          </Toolbar>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        SEPARATOR
        Visually divides logical groups within the toolbar.
        Uses a 1px vertical line at 1rem height.
    -------------------------------------------------------- */}
    <StorySection title="Separator" description="Divides logical groups. Automatically switches to horizontal in a vertical toolbar.">
      <StoryRow>
        <StoryItem label="with separator">
          <Toolbar>
            <ToolbarIconButton variant="ghost" icon="bold" label="Bold" />
            <ToolbarIconButton variant="ghost" icon="italic" label="Italic" />
            <ToolbarIconButton variant="ghost" icon="underline" label="Underline" />
            <ToolbarSeparator />
            <ToolbarIconButton variant="ghost" icon="align-left" label="Align left" />
            <ToolbarIconButton variant="ghost" icon="align-center" label="Align center" />
            <ToolbarIconButton variant="ghost" icon="align-right" label="Align right" />
          </Toolbar>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        MIXED CONTENT
        Select and other non-button controls can sit alongside
        Toolbar* components. They don't participate in arrow-key
        navigation but Tab navigation still works correctly.
    -------------------------------------------------------- */}
    <StorySection title="Mixed content" description="Select and other controls can sit alongside toolbar items. They won't participate in arrow-key nav but Tab still works.">
      <StoryRow>
        <StoryItem label="with select">
          <Toolbar>
            <Select
              variant="ghost"
              size="md"
              options={[
                { label: 'Paragraph', value: 'p' },
                { label: 'Heading 1', value: 'h1' },
                { label: 'Heading 2', value: 'h2' },
              ]}
              value="p"
            />
            <ToolbarSeparator />
            <ToolbarIconButton variant="ghost" icon="bold" label="Bold" />
            <ToolbarIconButton variant="ghost" icon="italic" label="Italic" />
            <ToolbarSeparator />
            <ToolbarIconButton variant="ghost" icon="link" label="Insert link" />
          </Toolbar>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        VERTICAL
        Orientation switches flex direction and separator
        orientation automatically via the aria-orientation
        attribute set by the Base UI primitive.
    -------------------------------------------------------- */}
    <StorySection title="Vertical" description="Switches to column layout. Separator becomes horizontal automatically.">
      <StoryRow>
        <StoryItem label="vertical">
          <Toolbar orientation="vertical">
            <ToolbarIconButton variant="ghost" icon="mouse-pointer" label="Select" />
            <ToolbarIconButton variant="ghost" icon="pencil" label="Draw" />
            <ToolbarIconButton variant="ghost" icon="type" label="Text" />
            <ToolbarSeparator />
            <ToolbarIconButton variant="ghost" icon="square" label="Rectangle" />
            <ToolbarIconButton variant="ghost" icon="circle" label="Ellipse" />
          </Toolbar>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        VARIANTS
        Toolbar inherits button variants — match the variant
        to the surface context the toolbar lives in.
    -------------------------------------------------------- */}
    <StorySection title="Variants" description="Match the button variant to the toolbar's surface context.">
      <StoryRow>
        <StoryItem label="ghost (floating toolbar)">
          <Toolbar>
            <ToolbarIconButton variant="ghost" icon="bold" label="Bold" />
            <ToolbarIconButton variant="ghost" icon="italic" label="Italic" />
            <ToolbarIconButton variant="ghost" icon="strikethrough" label="Strikethrough" />
          </Toolbar>
        </StoryItem>
        <StoryItem label="filled (raised toolbar)">
          <Toolbar>
            <ToolbarIconButton variant="filled" icon="bold" label="Bold" />
            <ToolbarIconButton variant="filled" icon="italic" label="Italic" />
            <ToolbarIconButton variant="filled" icon="strikethrough" label="Strikethrough" />
          </Toolbar>
        </StoryItem>
        <StoryItem label="subtle (panel toolbar)">
          <div style={{ background: 'var(--surface-subtle)', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)' }}>
            <Toolbar>
              <ToolbarIconButton variant="subtle" icon="bold" label="Bold" />
              <ToolbarIconButton variant="subtle" icon="italic" label="Italic" />
              <ToolbarIconButton variant="subtle" icon="strikethrough" label="Strikethrough" />
            </Toolbar>
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

  </Story>
);
