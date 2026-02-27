/**
 * TextInput.stories.tsx
 * Dev reference for the TextInput primitive.
 */

import { TextInput } from './TextInput';
import { Story, StorySection, StoryRow, StoryItem } from '../../dev/Story';

export const TextInputStories = () => (
  <Story title="TextInput">

    {/* --------------------------------------------------------
        VARIANTS
    -------------------------------------------------------- */}
    <StorySection title="Variants" description="ghost | subtle | outline | filled — match Button and Select variants exactly.">
      <StoryRow>
        <StoryItem label="ghost">
          <TextInput variant="ghost" placeholder="Untitled..." />
        </StoryItem>
        <StoryItem label="subtle">
          <div style={{ width: 200 }}>
            <TextInput variant="subtle" placeholder="Placeholder..." />
          </div>
        </StoryItem>
        <StoryItem label="outline (default)">
          <div style={{ width: 200 }}>
            <TextInput variant="outline" placeholder="Placeholder..." />
          </div>
        </StoryItem>
        <StoryItem label="filled">
          <div style={{ width: 200 }}>
            <TextInput variant="filled" placeholder="Placeholder..." />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>


    {/* --------------------------------------------------------
        SIZES
    -------------------------------------------------------- */}
    <StorySection title="Sizes" description="sm=1.5rem, md=1.75rem, lg=2.25rem (default). Match Button/Select heights exactly.">
      <StoryRow label="outline">
        <StoryItem label="sm">
          <div style={{ width: 200 }}>
            <TextInput variant="outline" size="sm" placeholder="Small..." />
          </div>
        </StoryItem>
        <StoryItem label="md">
          <div style={{ width: 200 }}>
            <TextInput variant="outline" size="md" placeholder="Medium..." />
          </div>
        </StoryItem>
        <StoryItem label="lg (default)">
          <div style={{ width: 200 }}>
            <TextInput variant="outline" size="lg" placeholder="Large..." />
          </div>
        </StoryItem>
      </StoryRow>
      <StoryRow label="filled">
        <StoryItem label="sm">
          <div style={{ width: 200 }}>
            <TextInput variant="filled" size="sm" placeholder="Small..." />
          </div>
        </StoryItem>
        <StoryItem label="md">
          <div style={{ width: 200 }}>
            <TextInput variant="filled" size="md" placeholder="Medium..." />
          </div>
        </StoryItem>
        <StoryItem label="lg (default)">
          <div style={{ width: 200 }}>
            <TextInput variant="filled" size="lg" placeholder="Large..." />
          </div>
        </StoryItem>
      </StoryRow>
      <StoryRow label="subtle">
        <StoryItem label="sm">
          <div style={{ width: 200 }}>
            <TextInput variant="subtle" size="sm" placeholder="Small..." />
          </div>
        </StoryItem>
        <StoryItem label="md">
          <div style={{ width: 200 }}>
            <TextInput variant="subtle" size="md" placeholder="Medium..." />
          </div>
        </StoryItem>
        <StoryItem label="lg (default)">
          <div style={{ width: 200 }}>
            <TextInput variant="subtle" size="lg" placeholder="Large..." />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>


    {/* --------------------------------------------------------
        INVALID
    -------------------------------------------------------- */}
    <StorySection title="Invalid" description="Applies error styling per variant.">
      <StoryRow>
        <StoryItem label="outline">
          <div style={{ width: 200 }}>
            <TextInput variant="outline" value="bad value" invalid />
          </div>
        </StoryItem>
        <StoryItem label="filled">
          <div style={{ width: 200 }}>
            <TextInput variant="filled" value="bad value" invalid />
          </div>
        </StoryItem>
        <StoryItem label="subtle">
          <div style={{ width: 200 }}>
            <TextInput variant="subtle" value="bad value" invalid />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>


    {/* --------------------------------------------------------
        DISABLED
    -------------------------------------------------------- */}
    <StorySection title="Disabled" description="All variants handled consistently.">
      <StoryRow>
        <StoryItem label="outline">
          <div style={{ width: 200 }}>
            <TextInput variant="outline" value="hello@example.com" disabled />
          </div>
        </StoryItem>
        <StoryItem label="filled">
          <div style={{ width: 200 }}>
            <TextInput variant="filled" value="hello@example.com" disabled />
          </div>
        </StoryItem>
        <StoryItem label="subtle">
          <div style={{ width: 200 }}>
            <TextInput variant="subtle" value="hello@example.com" disabled />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>


    {/* --------------------------------------------------------
        LEADING / TRAILING
    -------------------------------------------------------- */}
    <StorySection title="Leading / trailing" description="leading for icons and prefixes. trailing for interactive elements.">
      <StoryRow>
        <StoryItem label="leading icon">
          <div style={{ width: 220 }}>
            <TextInput
              variant="outline"
              placeholder="Search..."
              leading={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              }
            />
          </div>
        </StoryItem>
        <StoryItem label="trailing unit">
          <div style={{ width: 160 }}>
            <TextInput
              variant="outline"
              placeholder="0"
              trailing={
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-subtle)' }}>px</span>
              }
            />
          </div>
        </StoryItem>
        <StoryItem label="both">
          <div style={{ width: 240 }}>
            <TextInput
              variant="filled"
              placeholder="Search..."
              leading={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              }
              trailing={
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-subtle)' }}>⌘K</span>
              }
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>


    {/* --------------------------------------------------------
        CLEARABLE
    -------------------------------------------------------- */}
    <StorySection title="Clearable" description="Shows an X button when the input has a value. Type to see the clear button appear.">
      <StoryRow>
        <StoryItem label="outline">
          <div style={{ width: 220 }}>
            <TextInput
              variant="outline"
              placeholder="Type something..."
              defaultValue="Clear me"
              clearable
            />
          </div>
        </StoryItem>
        <StoryItem label="filled">
          <div style={{ width: 220 }}>
            <TextInput
              variant="filled"
              placeholder="Type something..."
              defaultValue="Clear me"
              clearable
            />
          </div>
        </StoryItem>
        <StoryItem label="subtle">
          <div style={{ width: 220 }}>
            <TextInput
              variant="subtle"
              placeholder="Type something..."
              defaultValue="Clear me"
              clearable
            />
          </div>
        </StoryItem>
        <StoryItem label="empty (no button)">
          <div style={{ width: 220 }}>
            <TextInput
              variant="outline"
              placeholder="Type to see clear..."
              clearable
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>


    {/* --------------------------------------------------------
        GHOST — INLINE EDITING
    -------------------------------------------------------- */}
    <StorySection title="Ghost — inline editing" description="Invisible until focused. Use textSize, weight, and color to match surrounding typographic context.">
      <StoryRow>
        <StoryItem label="page title">
          <div style={{ width: 360 }}>
            <TextInput
              variant="ghost"
              placeholder="Untitled"
              defaultValue="My Document"
              textSize="xl"
              weight="bold"
            />
          </div>
        </StoryItem>
        <StoryItem label="section heading">
          <div style={{ width: 280 }}>
            <TextInput
              variant="ghost"
              placeholder="Section name"
              defaultValue="Getting started"
              textSize="lg"
              weight="semibold"
            />
          </div>
        </StoryItem>
        <StoryItem label="inline value">
          <div style={{ width: 160 }}>
            <TextInput
              variant="ghost"
              placeholder="—"
              defaultValue="42"
              textSize="sm"
              color="muted"
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

  </Story>
);
