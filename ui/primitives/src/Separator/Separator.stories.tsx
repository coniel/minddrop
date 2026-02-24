/**
 * Separator.stories.tsx
 * Dev reference for the Separator component.
 */

import { Separator } from './Separator';
import { Story, StorySection, StoryRow, StoryItem } from '../dev/Story';

export const SeparatorStories = () => (
  <Story title="Separator">

    {/* --------------------------------------------------------
        ORIENTATION
        Horizontal fills its container's width at 1px height.
        Vertical fills its container's height at 1px width —
        requires the parent to have a defined height.
    -------------------------------------------------------- */}
    <StorySection title="Orientation" description="Horizontal fills container width. Vertical fills container height — parent needs a defined height.">
      <StoryRow>
        <StoryItem label="horizontal">
          <div style={{ width: 200 }}>
            <Separator orientation="horizontal" />
          </div>
        </StoryItem>
        <StoryItem label="vertical">
          <div style={{ height: 32, display: 'flex', alignItems: 'stretch' }}>
            <Separator orientation="vertical" />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        MARGIN
        Adds equal margin on both sides. small=8px, medium=12px,
        large=24px. Most commonly used in menus (small) and
        between content sections (medium/large).
    -------------------------------------------------------- */}
    <StorySection title="Margin" description="Equal margin on both sides. small for menus, medium for section dividers, large for page-level separation.">
      <StoryRow>
        <StoryItem label="none">
          <div style={{ width: 200, background: 'var(--surface-subtle)', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ height: 12 }} />
            <Separator orientation="horizontal" />
            <div style={{ height: 12 }} />
          </div>
        </StoryItem>
        <StoryItem label="small">
          <div style={{ width: 200, background: 'var(--surface-subtle)', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)' }}>
            <Separator orientation="horizontal" margin="small" />
          </div>
        </StoryItem>
        <StoryItem label="medium">
          <div style={{ width: 200, background: 'var(--surface-subtle)', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)' }}>
            <Separator orientation="horizontal" margin="medium" />
          </div>
        </StoryItem>
        <StoryItem label="large">
          <div style={{ width: 200, background: 'var(--surface-subtle)', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)' }}>
            <Separator orientation="horizontal" margin="large" />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

  </Story>
);
