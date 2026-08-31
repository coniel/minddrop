import { registerStory } from '@minddrop/dev-tools';
/**
 * TextField.stories.tsx
 * Dev reference for TextField and FieldLabel.
 */
import { Story, StoryItem, StoryRow, StorySection } from '../../dev/Story';
import { TextField } from './TextField';

export const TextFieldStories = () => (
  <Story title="TextField">
    {/* --------------------------------------------------------
        VARIANTS
        Matches Button/Select variants exactly so they can sit
        side by side in toolbars and forms without visual mismatch.
    -------------------------------------------------------- */}
    <StorySection
      title="Variants"
      description="ghost | subtle | outline | filled — match Button and Select variants exactly."
    >
      <StoryRow>
        <StoryItem label="ghost">
          <TextField
            variant="ghost"
            stringPlaceholder="Untitled..."
            size="lg"
          />
        </StoryItem>
        <StoryItem label="subtle">
          <div style={{ width: 200 }}>
            <TextField variant="subtle" stringPlaceholder="Placeholder..." />
          </div>
        </StoryItem>
        <StoryItem label="outline (default)">
          <div style={{ width: 200 }}>
            <TextField variant="outline" stringPlaceholder="Placeholder..." />
          </div>
        </StoryItem>
        <StoryItem label="filled">
          <div style={{ width: 200 }}>
            <TextField variant="filled" stringPlaceholder="Placeholder..." />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        SIZES
        sm / md / lg match Button and Select heights exactly.
        lg is the default.
    -------------------------------------------------------- */}
    <StorySection
      title="Sizes"
      description="sm=1.5rem, md=1.75rem, lg=2.25rem (default). Match Button/Select heights exactly."
    >
      <StoryRow label="outline">
        <StoryItem label="sm">
          <div style={{ width: 200 }}>
            <TextField
              variant="outline"
              size="sm"
              stringPlaceholder="Small..."
            />
          </div>
        </StoryItem>
        <StoryItem label="md">
          <div style={{ width: 200 }}>
            <TextField
              variant="outline"
              size="md"
              stringPlaceholder="Medium..."
            />
          </div>
        </StoryItem>
        <StoryItem label="lg (default)">
          <div style={{ width: 200 }}>
            <TextField
              variant="outline"
              size="lg"
              stringPlaceholder="Large..."
            />
          </div>
        </StoryItem>
      </StoryRow>
      <StoryRow label="filled">
        <StoryItem label="sm">
          <div style={{ width: 200 }}>
            <TextField
              variant="filled"
              size="sm"
              stringPlaceholder="Small..."
            />
          </div>
        </StoryItem>
        <StoryItem label="md">
          <div style={{ width: 200 }}>
            <TextField
              variant="filled"
              size="md"
              stringPlaceholder="Medium..."
            />
          </div>
        </StoryItem>
        <StoryItem label="lg (default)">
          <div style={{ width: 200 }}>
            <TextField
              variant="filled"
              size="lg"
              stringPlaceholder="Large..."
            />
          </div>
        </StoryItem>
      </StoryRow>
      <StoryRow label="subtle">
        <StoryItem label="sm">
          <div style={{ width: 200 }}>
            <TextField
              variant="subtle"
              size="sm"
              stringPlaceholder="Small..."
            />
          </div>
        </StoryItem>
        <StoryItem label="md">
          <div style={{ width: 200 }}>
            <TextField
              variant="subtle"
              size="md"
              stringPlaceholder="Medium..."
            />
          </div>
        </StoryItem>
        <StoryItem label="lg (default)">
          <div style={{ width: 200 }}>
            <TextField
              variant="subtle"
              size="lg"
              stringPlaceholder="Large..."
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        LABEL + DESCRIPTION
    -------------------------------------------------------- */}
    <StorySection
      title="Label and description"
      description="Label renders above via Field.Label. Description is hidden when an error is present."
    >
      <StoryRow>
        <StoryItem label="label only">
          <div style={{ width: 240 }}>
            <TextField
              variant="outline"
              stringLabel="Display name"
              stringPlaceholder="Your name..."
            />
          </div>
        </StoryItem>
        <StoryItem label="label + description">
          <div style={{ width: 240 }}>
            <TextField
              variant="outline"
              stringLabel="Username"
              stringDescription="Visible to other members."
              stringPlaceholder="username"
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        VALIDATION
    -------------------------------------------------------- */}
    <StorySection
      title="Validation"
      description="Passing error puts the field into invalid state and hides the description."
    >
      <StoryRow>
        <StoryItem label="outline">
          <div style={{ width: 240 }}>
            <TextField
              variant="outline"
              stringLabel="Email"
              value="not-an-email"
              stringError="Please enter a valid email address."
            />
          </div>
        </StoryItem>
        <StoryItem label="filled">
          <div style={{ width: 240 }}>
            <TextField
              variant="filled"
              stringLabel="Email"
              value="not-an-email"
              stringError="Please enter a valid email address."
            />
          </div>
        </StoryItem>
        <StoryItem label="subtle">
          <div style={{ width: 240 }}>
            <TextField
              variant="subtle"
              stringLabel="Email"
              value="not-an-email"
              stringError="Please enter a valid email address."
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        DISABLED
    -------------------------------------------------------- */}
    <StorySection
      title="Disabled"
      description="Propagates through Field.Root — all variants handled consistently."
    >
      <StoryRow>
        <StoryItem label="outline">
          <div style={{ width: 200 }}>
            <TextField variant="outline" value="hello@example.com" disabled />
          </div>
        </StoryItem>
        <StoryItem label="filled">
          <div style={{ width: 200 }}>
            <TextField variant="filled" value="hello@example.com" disabled />
          </div>
        </StoryItem>
        <StoryItem label="subtle">
          <div style={{ width: 200 }}>
            <TextField variant="subtle" value="hello@example.com" disabled />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        LEADING / TRAILING
    -------------------------------------------------------- */}
    <StorySection
      title="Leading / trailing"
      description="leading for icons and prefixes (pointer-events off). trailing for interactive elements like clear buttons (pointer-events on)."
    >
      <StoryRow>
        <StoryItem label="leading icon">
          <div style={{ width: 220 }}>
            <TextField
              variant="outline"
              stringPlaceholder="Search..."
              leading={
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              }
            />
          </div>
        </StoryItem>
        <StoryItem label="trailing unit">
          <div style={{ width: 160 }}>
            <TextField
              variant="outline"
              stringPlaceholder="0"
              type="number"
              trailing={
                <span
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--text-subtle)',
                  }}
                >
                  px
                </span>
              }
            />
          </div>
        </StoryItem>
        <StoryItem label="both">
          <div style={{ width: 240 }}>
            <TextField
              variant="filled"
              stringPlaceholder="Search..."
              leading={
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              }
              trailing={
                <span
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--text-subtle)',
                    cursor: 'pointer',
                  }}
                >
                  ⌘K
                </span>
              }
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        TYPES
    -------------------------------------------------------- */}
    <StorySection
      title="Types"
      description="All standard HTML input types are passed through to the Base UI Input primitive."
    >
      <StoryRow>
        <StoryItem label="password">
          <div style={{ width: 200 }}>
            <TextField
              stringLabel="Password"
              type="password"
              stringPlaceholder="••••••••"
            />
          </div>
        </StoryItem>
        <StoryItem label="email">
          <div style={{ width: 200 }}>
            <TextField
              stringLabel="Email"
              type="email"
              stringPlaceholder="you@example.com"
            />
          </div>
        </StoryItem>
        <StoryItem label="number">
          <div style={{ width: 160 }}>
            <TextField
              stringLabel="Amount"
              type="number"
              stringPlaceholder="0"
            />
          </div>
        </StoryItem>
        <StoryItem label="search">
          <div style={{ width: 200 }}>
            <TextField type="search" stringPlaceholder="Search..." />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        GHOST - INLINE EDITING
        Ghost is borderless and invisible until focused.
        textSize/weight/color props match surrounding typography.
    -------------------------------------------------------- */}
    <StorySection
      title="Ghost — inline editing"
      description="Invisible until focused. Use textSize, weight, and color to match surrounding typographic context."
    >
      <StoryRow>
        <StoryItem label="page title">
          <div style={{ width: 360 }}>
            <TextField
              variant="ghost"
              stringPlaceholder="Untitled"
              defaultValue="My Document"
              textSize="xl"
              weight="bold"
            />
          </div>
        </StoryItem>
        <StoryItem label="section heading">
          <div style={{ width: 280 }}>
            <TextField
              variant="ghost"
              stringPlaceholder="Section name"
              defaultValue="Getting started"
              textSize="lg"
              weight="semibold"
            />
          </div>
        </StoryItem>
        <StoryItem label="inline value">
          <div style={{ width: 160 }}>
            <TextField
              variant="ghost"
              stringPlaceholder="—"
              defaultValue="42"
              textSize="sm"
              color="muted"
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        SIDE BY SIDE WITH BUTTON/SELECT
        The key use case - showing that sizes align exactly.
    -------------------------------------------------------- */}
    <StorySection
      title="Composed with Button and Select"
      description="TextField sizes align exactly with Button and Select heights for clean side-by-side composition."
    >
      <StoryRow>
        <StoryItem label="search bar (lg)">
          <div style={{ display: 'flex', gap: 'var(--space-2)', width: 340 }}>
            <TextField
              variant="filled"
              stringPlaceholder="Search..."
              size="lg"
            />
            <button
              style={{
                height: '2.25rem',
                padding: '0 var(--space-4)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-solid-primary)',
                color: 'white',
                border: 'none',
                fontFamily: 'var(--font-ui)',
                fontSize: 'var(--font-size-base)',
                cursor: 'default',
                flexShrink: 0,
              }}
            >
              Go
            </button>
          </div>
        </StoryItem>
        <StoryItem label="inline filter (md)">
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-2)',
              alignItems: 'center',
            }}
          >
            <TextField
              variant="subtle"
              stringPlaceholder="Filter..."
              size="md"
            />
            <select
              style={{
                height: '1.75rem',
                padding: '0 var(--space-2)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)',
                fontFamily: 'var(--font-ui)',
                fontSize: 'var(--font-size-sm)',
                background: 'var(--surface-overlay)',
                color: 'var(--text-muted)',
                cursor: 'default',
              }}
            >
              <option>All types</option>
            </select>
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>
  </Story>
);

registerStory({
  group: 'Fields',
  label: 'TextField',
  component: TextFieldStories,
});
