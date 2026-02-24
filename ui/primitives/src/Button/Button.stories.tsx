/**
 * Button.stories.tsx
 * Dev reference for the Button component.
 */

import { Button } from './Button';
import { Story, StorySection, StoryRow, StoryItem } from '../dev/Story';

export const ButtonStories = () => (
  <Story title="Button">

    {/* --------------------------------------------------------
        VARIANTS
        Five visual styles from least to most prominent. Mix
        variants within a UI to create visual hierarchy.
    -------------------------------------------------------- */}
    <StorySection title="Variants" description="Five visual styles from least to most prominent. Mix variants within a UI to create visual hierarchy.">
      <StoryRow>
        <StoryItem label="ghost"><Button variant="ghost">Ghost</Button></StoryItem>
        <StoryItem label="subtle"><Button variant="subtle">Subtle</Button></StoryItem>
        <StoryItem label="outline"><Button variant="outline">Outline</Button></StoryItem>
        <StoryItem label="filled"><Button variant="filled">Filled</Button></StoryItem>
        <StoryItem label="solid"><Button variant="solid">Solid</Button></StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        SIZES
        Three sizes matching Select and IconButton for seamless
        composition in toolbars and action rows.
    -------------------------------------------------------- */}
    <StorySection title="Sizes" description="Three sizes matching Select and IconButton. Always use the same size for all controls in a toolbar row.">
      <StoryRow>
        <StoryItem label="sm"><Button variant="filled" size="sm">Small</Button></StoryItem>
        <StoryItem label="md (default)"><Button variant="filled" size="md">Medium</Button></StoryItem>
        <StoryItem label="lg"><Button variant="filled" size="lg">Large</Button></StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        COLORS
        Applied on top of any variant. Use primary sparingly —
        one per view. Use danger for destructive actions.
    -------------------------------------------------------- */}
    <StorySection title="Colors" description="Applied on top of any variant. Use primary sparingly — one per view. Use danger for destructive actions.">
      <StoryRow label="ghost">
        <StoryItem label="neutral (default)"><Button variant="ghost" color="neutral">Neutral</Button></StoryItem>
        <StoryItem label="primary"><Button variant="ghost" color="primary">Primary</Button></StoryItem>
        <StoryItem label="danger"><Button variant="ghost" color="danger">Danger</Button></StoryItem>
      </StoryRow>
      <StoryRow label="filled">
        <StoryItem label="neutral"><Button variant="filled" color="neutral">Neutral</Button></StoryItem>
        <StoryItem label="primary"><Button variant="filled" color="primary">Primary</Button></StoryItem>
        <StoryItem label="danger"><Button variant="filled" color="danger">Danger</Button></StoryItem>
      </StoryRow>
      <StoryRow label="solid">
        <StoryItem label="neutral"><Button variant="solid" color="neutral">Neutral</Button></StoryItem>
        <StoryItem label="primary"><Button variant="solid" color="primary">Primary</Button></StoryItem>
        <StoryItem label="danger"><Button variant="solid" color="danger">Danger</Button></StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        DANGER PROP
        'on-hover' keeps the UI calm until the user signals
        intent. 'always' is for confirmation states.
    -------------------------------------------------------- */}
    <StorySection title="Danger prop" description="Conditionally applies danger color. 'on-hover' keeps the UI calm until the user signals intent. 'always' is for confirmation states.">
      <StoryRow>
        <StoryItem label="on-hover (ghost)"><Button variant="ghost" danger="on-hover">Delete</Button></StoryItem>
        <StoryItem label="always (ghost)"><Button variant="ghost" danger="always">Delete</Button></StoryItem>
        <StoryItem label="on-hover (filled)"><Button variant="filled" danger="on-hover">Delete</Button></StoryItem>
        <StoryItem label="always (filled)"><Button variant="filled" danger="always">Delete</Button></StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        ICONS
        Start and end icons with adjusted padding for optical
        balance. Icons scale with button size via 1em sizing.
    -------------------------------------------------------- */}
    <StorySection title="Icons" description="Adjusted padding on the icon side maintains optical balance. Icons scale with button size.">
      <StoryRow>
        <StoryItem label="startIcon"><Button variant="filled" startIcon="plus">New Item</Button></StoryItem>
        <StoryItem label="endIcon"><Button variant="filled" endIcon="chevron-down">Options</Button></StoryItem>
        <StoryItem label="both"><Button variant="filled" startIcon="filter" endIcon="chevron-down">Filter</Button></StoryItem>
        <StoryItem label="icon only"><Button variant="ghost" startIcon="settings" /></StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        STATES
        Active locks the button in its hover/selected state.
        Disabled reduces opacity and removes pointer events.
    -------------------------------------------------------- */}
    <StorySection title="States" description="Active is for toggleable buttons. Disabled should be used sparingly — prefer hiding unavailable actions.">
      <StoryRow>
        <StoryItem label="active (ghost)"><Button variant="ghost" active>Active</Button></StoryItem>
        <StoryItem label="active (filled)"><Button variant="filled" active>Active</Button></StoryItem>
        <StoryItem label="active (subtle)"><Button variant="subtle" active>Active</Button></StoryItem>
        <StoryItem label="disabled"><Button variant="filled" disabled>Disabled</Button></StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        SUBTLE — PANEL USE
        Always-visible muted background without borders. Keeps
        controls discoverable in dense property editor panels
        without visual clutter.
    -------------------------------------------------------- */}
    <StorySection title="Subtle variant — panel use" description="Always-visible muted background without borders. Designed for dense property-editor style panels." tinted>
      <StoryRow>
        <StoryItem label="default"><Button variant="subtle">Label</Button></StoryItem>
        <StoryItem label="active"><Button variant="subtle" active>Active</Button></StoryItem>
        <StoryItem label="primary"><Button variant="subtle" color="primary">Primary</Button></StoryItem>
        <StoryItem label="with icon"><Button variant="subtle" startIcon="align-left">Align</Button></StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        COMPOSITION
        Buttons, IconButtons, and Selects share sizes and
        variants so they sit flush in toolbars without adjustment.
    -------------------------------------------------------- */}
    <StorySection title="Composition" description="Shared sizes and variants ensure buttons sit flush with Selects and IconButtons in toolbar rows.">
      <StoryRow>
        <StoryItem label="ghost toolbar">
          <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
            <Button variant="ghost" startIcon="bold" />
            <Button variant="ghost" startIcon="italic" />
            <Button variant="ghost" startIcon="underline" />
          </div>
        </StoryItem>
        <StoryItem label="action row">
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button variant="filled">Cancel</Button>
            <Button variant="solid" color="primary">Save</Button>
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

  </Story>
);
