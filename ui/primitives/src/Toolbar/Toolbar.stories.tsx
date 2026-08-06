/**
 * Toolbar.stories.tsx
 * Dev reference for the Toolbar component.
 */
import { Select } from '../Select';
import { Story, StoryItem, StoryRow, StorySection } from '../dev/Story';
import {
  Toolbar,
  ToolbarButton,
  ToolbarIconButton,
  ToolbarSeparator,
} from './Toolbar';

export const ToolbarStories = () => (
  <Story title="Toolbar">
    {/* --------------------------------------------------------
        BASIC
        Built on Base UI Toolbar for accessible keyboard nav.
        Arrow keys move focus between items, Tab exits the toolbar.
        Always use Toolbar* components as children — plain buttons
        won't participate in keyboard navigation.
    -------------------------------------------------------- */}
    <StorySection
      title="Basic"
      description="Arrow keys navigate between items, Tab exits. Always use ToolbarButton and ToolbarIconButton — plain buttons won't participate in keyboard navigation."
    >
      <StoryRow>
        <StoryItem label="icon buttons">
          <Toolbar>
            <ToolbarIconButton variant="ghost" icon="bold" stringLabel="Bold" />
            <ToolbarIconButton
              variant="ghost"
              icon="italic"
              stringLabel="Italic"
            />
            <ToolbarIconButton
              variant="ghost"
              icon="underline"
              stringLabel="Underline"
            />
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
    <StorySection
      title="Separator"
      description="Divides logical groups. Automatically switches to horizontal in a vertical toolbar."
    >
      <StoryRow>
        <StoryItem label="with separator">
          <Toolbar>
            <ToolbarIconButton variant="ghost" icon="bold" stringLabel="Bold" />
            <ToolbarIconButton
              variant="ghost"
              icon="italic"
              stringLabel="Italic"
            />
            <ToolbarIconButton
              variant="ghost"
              icon="underline"
              stringLabel="Underline"
            />
            <ToolbarSeparator />
            <ToolbarIconButton
              variant="ghost"
              icon="align-left"
              stringLabel="Align left"
            />
            <ToolbarIconButton
              variant="ghost"
              icon="align-center"
              stringLabel="Align center"
            />
            <ToolbarIconButton
              variant="ghost"
              icon="align-right"
              stringLabel="Align right"
            />
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
    <StorySection
      title="Mixed content"
      description="Select and other controls can sit alongside toolbar items. They won't participate in arrow-key nav but Tab still works."
    >
      <StoryRow>
        <StoryItem label="with select">
          <Toolbar>
            <Select
              variant="ghost"
              size="md"
              options={[
                { stringLabel: 'Paragraph', value: 'p' },
                { stringLabel: 'Heading 1', value: 'h1' },
                { stringLabel: 'Heading 2', value: 'h2' },
              ]}
              value="p"
            />
            <ToolbarSeparator />
            <ToolbarIconButton variant="ghost" icon="bold" stringLabel="Bold" />
            <ToolbarIconButton
              variant="ghost"
              icon="italic"
              stringLabel="Italic"
            />
            <ToolbarSeparator />
            <ToolbarIconButton
              variant="ghost"
              icon="link"
              stringLabel="Insert link"
            />
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
    <StorySection
      title="Vertical"
      description="Switches to column layout. Separator becomes horizontal automatically."
    >
      <StoryRow>
        <StoryItem label="vertical">
          <Toolbar orientation="vertical">
            <ToolbarIconButton
              variant="ghost"
              icon="mouse-pointer"
              stringLabel="Select"
            />
            <ToolbarIconButton
              variant="ghost"
              icon="pencil"
              stringLabel="Draw"
            />
            <ToolbarIconButton variant="ghost" icon="type" stringLabel="Text" />
            <ToolbarSeparator />
            <ToolbarIconButton
              variant="ghost"
              icon="square"
              stringLabel="Rectangle"
            />
            <ToolbarIconButton
              variant="ghost"
              icon="circle"
              stringLabel="Ellipse"
            />
          </Toolbar>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        VARIANTS
        Toolbar inherits button variants — match the variant
        to the surface context the toolbar lives in.
    -------------------------------------------------------- */}
    <StorySection
      title="Variants"
      description="Match the button variant to the toolbar's surface context."
    >
      <StoryRow>
        <StoryItem label="ghost (floating toolbar)">
          <Toolbar>
            <ToolbarIconButton variant="ghost" icon="bold" stringLabel="Bold" />
            <ToolbarIconButton
              variant="ghost"
              icon="italic"
              stringLabel="Italic"
            />
            <ToolbarIconButton
              variant="ghost"
              icon="strikethrough"
              stringLabel="Strikethrough"
            />
          </Toolbar>
        </StoryItem>
        <StoryItem label="filled (raised toolbar)">
          <Toolbar>
            <ToolbarIconButton
              variant="filled"
              icon="bold"
              stringLabel="Bold"
            />
            <ToolbarIconButton
              variant="filled"
              icon="italic"
              stringLabel="Italic"
            />
            <ToolbarIconButton
              variant="filled"
              icon="strikethrough"
              stringLabel="Strikethrough"
            />
          </Toolbar>
        </StoryItem>
        <StoryItem label="subtle (panel toolbar)">
          <div
            style={{
              background: 'var(--surface-subtle)',
              padding: 'var(--space-2)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <Toolbar>
              <ToolbarIconButton
                variant="subtle"
                icon="bold"
                stringLabel="Bold"
              />
              <ToolbarIconButton
                variant="subtle"
                icon="italic"
                stringLabel="Italic"
              />
              <ToolbarIconButton
                variant="subtle"
                icon="strikethrough"
                stringLabel="Strikethrough"
              />
            </Toolbar>
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>
  </Story>
);
