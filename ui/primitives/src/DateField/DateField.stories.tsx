/**
 * DateField.stories.tsx
 * Dev reference for the DateInput and DateField components.
 */
import { Story, StoryItem, StoryRow, StorySection } from '../dev/Story';
import { DateField } from './DateField';
import { DateInput } from './DateInput';

export const DateFieldStories = () => (
  <Story title="DateField">
    {/* --------------------------------------------------------
        DATE INPUT — VARIANTS
    -------------------------------------------------------- */}
    <StorySection
      title="DateInput — Variants"
      description="ghost | subtle | outline | filled — match TextInput variants."
    >
      <StoryRow>
        <StoryItem label="ghost">
          <div style={{ width: 200 }}>
            <DateInput variant="ghost" placeholder="Pick a date..." />
          </div>
        </StoryItem>
        <StoryItem label="subtle">
          <div style={{ width: 200 }}>
            <DateInput variant="subtle" placeholder="Pick a date..." />
          </div>
        </StoryItem>
        <StoryItem label="outline (default)">
          <div style={{ width: 200 }}>
            <DateInput variant="outline" placeholder="Pick a date..." />
          </div>
        </StoryItem>
        <StoryItem label="filled">
          <div style={{ width: 200 }}>
            <DateInput variant="filled" placeholder="Pick a date..." />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        DATE INPUT — SIZES
    -------------------------------------------------------- */}
    <StorySection
      title="DateInput — Sizes"
      description="sm=1.5rem, md=1.75rem, lg=2.25rem (default)."
    >
      <StoryRow>
        <StoryItem label="sm">
          <div style={{ width: 200 }}>
            <DateInput size="sm" placeholder="Pick a date..." />
          </div>
        </StoryItem>
        <StoryItem label="md">
          <div style={{ width: 200 }}>
            <DateInput size="md" placeholder="Pick a date..." />
          </div>
        </StoryItem>
        <StoryItem label="lg (default)">
          <div style={{ width: 200 }}>
            <DateInput size="lg" placeholder="Pick a date..." />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        DATE INPUT — WITH VALUE
    -------------------------------------------------------- */}
    <StorySection
      title="DateInput — With value"
      description="Shows the formatted date when a value is set."
    >
      <StoryRow>
        <StoryItem label="default value">
          <div style={{ width: 200 }}>
            <DateInput defaultValue={new Date()} placeholder="Pick a date..." />
          </div>
        </StoryItem>
        <StoryItem label="clearable">
          <div style={{ width: 200 }}>
            <DateInput
              defaultValue={new Date()}
              placeholder="Pick a date..."
              clearable
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        DATE INPUT — INVALID
    -------------------------------------------------------- */}
    <StorySection
      title="DateInput — Invalid"
      description="Applies error styling per variant."
    >
      <StoryRow>
        <StoryItem label="outline">
          <div style={{ width: 200 }}>
            <DateInput variant="outline" defaultValue={new Date()} invalid />
          </div>
        </StoryItem>
        <StoryItem label="filled">
          <div style={{ width: 200 }}>
            <DateInput variant="filled" defaultValue={new Date()} invalid />
          </div>
        </StoryItem>
        <StoryItem label="subtle">
          <div style={{ width: 200 }}>
            <DateInput variant="subtle" defaultValue={new Date()} invalid />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        DATE INPUT — DISABLED
    -------------------------------------------------------- */}
    <StorySection
      title="DateInput — Disabled"
      description="All variants handled consistently."
    >
      <StoryRow>
        <StoryItem label="outline">
          <div style={{ width: 200 }}>
            <DateInput variant="outline" defaultValue={new Date()} disabled />
          </div>
        </StoryItem>
        <StoryItem label="filled">
          <div style={{ width: 200 }}>
            <DateInput variant="filled" defaultValue={new Date()} disabled />
          </div>
        </StoryItem>
        <StoryItem label="subtle">
          <div style={{ width: 200 }}>
            <DateInput variant="subtle" defaultValue={new Date()} disabled />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        DATE FIELD
    -------------------------------------------------------- */}
    <StorySection
      title="DateField"
      description="DateInput with label, description, and error support."
    >
      <StoryRow>
        <StoryItem label="default">
          <div style={{ width: 240 }}>
            <DateField
              label="Date"
              description="Select a date"
              placeholder="Pick a date..."
              clearable
            />
          </div>
        </StoryItem>
        <StoryItem label="with error">
          <div style={{ width: 240 }}>
            <DateField
              label="Date"
              error="Required"
              placeholder="Pick a date..."
            />
          </div>
        </StoryItem>
        <StoryItem label="disabled">
          <div style={{ width: 240 }}>
            <DateField
              label="Date"
              description="This field is disabled"
              defaultValue={new Date()}
              disabled
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>
  </Story>
);
