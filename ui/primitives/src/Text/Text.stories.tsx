/**
 * Text.stories.tsx
 * Dev reference for the Text component.
 */

import { Text } from './Text';
import { Story, StorySection, StoryRow, StoryItem } from '../dev/Story';

export const TextStories = () => (
  <Story title="Text">

    {/* --------------------------------------------------------
        SIZES
        xs–base are for UI chrome. md and above for content.
    -------------------------------------------------------- */}
    <StorySection title="Sizes" description="Five sizes from caption to heading. xs–base are for UI chrome; md and above are for content areas.">
      <StoryRow>
        <StoryItem label="xs — 12px"><Text size="xs">Caption, labels, badges</Text></StoryItem>
        <StoryItem label="sm — 13px"><Text size="sm">Secondary UI text</Text></StoryItem>
        <StoryItem label="base — 14px (default)"><Text size="base">Primary UI text</Text></StoryItem>
        <StoryItem label="lg — 20px"><Text size="lg">Content title</Text></StoryItem>
        <StoryItem label="xl — 24px"><Text size="xl">Section heading</Text></StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        COLORS
        Regular and muted cover most cases. Subtle for
        timestamps and metadata.
    -------------------------------------------------------- */}
    <StorySection title="Colors" description="Semantic color roles. Use regular for primary content, muted for supporting text, subtle for timestamps and metadata.">
      <StoryRow>
        <StoryItem label="regular (default)"><Text color="regular">Regular text</Text></StoryItem>
        <StoryItem label="muted"><Text color="muted">Muted text</Text></StoryItem>
        <StoryItem label="subtle"><Text color="subtle">Subtle text</Text></StoryItem>
        <StoryItem label="disabled"><Text color="disabled">Disabled text</Text></StoryItem>
        <StoryItem label="primary"><Text color="primary">Primary text</Text></StoryItem>
        <StoryItem label="danger"><Text color="danger">Danger text</Text></StoryItem>
        <StoryItem label="danger-muted"><Text color="danger-muted">Danger muted</Text></StoryItem>
        <StoryItem label="warning"><Text color="warning">Warning text</Text></StoryItem>
        <StoryItem label="info"><Text color="info">Info text</Text></StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        WEIGHTS
        Medium is the sweet spot for UI labels. Avoid bold
        in dense UIs — semibold achieves emphasis without
        heaviness.
    -------------------------------------------------------- */}
    <StorySection title="Weights" description="Four weights. Medium for UI labels, semibold for emphasis. Avoid bold in dense UIs.">
      <StoryRow>
        <StoryItem label="normal (default)"><Text weight="normal">Normal weight</Text></StoryItem>
        <StoryItem label="medium"><Text weight="medium">Medium weight</Text></StoryItem>
        <StoryItem label="semibold"><Text weight="semibold">Semibold weight</Text></StoryItem>
        <StoryItem label="bold"><Text weight="bold">Bold weight</Text></StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        MONO
        For technical content: version numbers, IDs, paths.
    -------------------------------------------------------- */}
    <StorySection title="Mono" description="Use for technical content that benefits from fixed-width rendering: version numbers, IDs, file paths.">
      <StoryRow>
        <StoryItem label="mono"><Text mono>v2.4.1</Text></StoryItem>
        <StoryItem label="mono muted"><Text mono color="muted">abc-123-def-456</Text></StoryItem>
        <StoryItem label="mono subtle sm"><Text mono size="sm" color="subtle">/usr/local/bin</Text></StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        PARAGRAPH
        Margin is suppressed on the last child automatically.
    -------------------------------------------------------- */}
    <StorySection title="Paragraph" description="Block display with comfortable line-height and spacing. Bottom margin is suppressed on the last child.">
      <StoryRow>
        <StoryItem label="paragraph">
          <div style={{ maxWidth: 400 }}>
            <Text paragraph>
              This is the first paragraph. It has comfortable line height and spacing below it.
            </Text>
            <Text paragraph>
              This is the second paragraph. It's the last child so it has no bottom margin — safe in cards and panels.
            </Text>
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        BLOCK + TRUNCATE
        Truncate requires a width-constrained parent.
    -------------------------------------------------------- */}
    <StorySection title="Block & Truncate" description="Block renders without paragraph margins. Truncate requires a width-constrained parent — it sets display:block automatically.">
      <StoryRow>
        <StoryItem label="block">
          <div style={{ background: 'var(--surface-subtle)', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)' }}>
            <Text block weight="medium">Label</Text>
            <Text block color="muted" size="sm">Supporting description below the label</Text>
          </div>
        </StoryItem>
        <StoryItem label="truncate">
          <div style={{ width: 180 }}>
            <Text truncate>This text is too long and will be clipped with an ellipsis</Text>
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        AS PROP
        Semantic element without affecting visual style.
    -------------------------------------------------------- */}
    <StorySection title="as prop" description="Renders as any HTML element for semantics without affecting visual style. Paragraph automatically uses 'p'.">
      <StoryRow>
        <StoryItem label="as='h2'"><Text as="h2" size="xl" weight="semibold">Section heading</Text></StoryItem>
        <StoryItem label="as='label'"><Text as="label" size="sm" weight="medium" color="muted">Field label</Text></StoryItem>
        <StoryItem label="paragraph → p"><Text paragraph color="muted" size="sm">Renders as p automatically.</Text></StoryItem>
      </StoryRow>
    </StorySection>

  </Story>
);
