/**
 * Toggle.stories.tsx
 * Dev reference for the Toggle component.
 */

import { useState } from 'react';
import { Toggle } from './Toggle';
import { Story, StorySection, StoryRow, StoryItem } from '../dev/Story';

export const ToggleStories = () => {
  const [pressed, setPressed] = useState(false);

  return (
    <Story title="Toggle">

      {/* --------------------------------------------------------
          VARIANTS
          Mirror IconButton variants exactly. Pressed state uses
          the same surface tokens as the persistent active state
          on buttons elsewhere in the system.
      -------------------------------------------------------- */}
      <StorySection title="Variants" description="Mirrors IconButton variants. Pressed state matches the persistent active/latched state used by buttons throughout the system.">
        <StoryRow>
          <StoryItem label="ghost">
            <Toggle icon="bold" label="Bold" variant="ghost" />
          </StoryItem>
          <StoryItem label="ghost pressed">
            <Toggle icon="bold" label="Bold" variant="ghost" pressed />
          </StoryItem>
          <StoryItem label="subtle">
            <Toggle icon="bold" label="Bold" variant="subtle" />
          </StoryItem>
          <StoryItem label="subtle pressed">
            <Toggle icon="bold" label="Bold" variant="subtle" pressed />
          </StoryItem>
          <StoryItem label="outline">
            <Toggle icon="bold" label="Bold" variant="outline" />
          </StoryItem>
          <StoryItem label="outline pressed">
            <Toggle icon="bold" label="Bold" variant="outline" pressed />
          </StoryItem>
          <StoryItem label="filled">
            <Toggle icon="bold" label="Bold" variant="filled" />
          </StoryItem>
          <StoryItem label="filled pressed">
            <Toggle icon="bold" label="Bold" variant="filled" pressed />
          </StoryItem>
        </StoryRow>
      </StorySection>


      {/* --------------------------------------------------------
          SIZES
      -------------------------------------------------------- */}
      <StorySection title="Sizes" description="sm=1.5rem, md=1.75rem, lg=2.25rem — match IconButton sizes exactly.">
        <StoryRow>
          <StoryItem label="sm">
            <Toggle icon="bold" label="Bold" size="sm" />
          </StoryItem>
          <StoryItem label="md (default)">
            <Toggle icon="bold" label="Bold" size="md" />
          </StoryItem>
          <StoryItem label="lg">
            <Toggle icon="bold" label="Bold" size="lg" />
          </StoryItem>
        </StoryRow>
      </StorySection>


      {/* --------------------------------------------------------
          COLOR
      -------------------------------------------------------- */}
      <StorySection title="Color" description="Primary color variant for contextual toggles like active formatting tools.">
        <StoryRow>
          <StoryItem label="neutral (default)">
            <Toggle icon="bold" label="Bold" />
          </StoryItem>
          <StoryItem label="neutral pressed">
            <Toggle icon="bold" label="Bold" pressed />
          </StoryItem>
          <StoryItem label="primary">
            <Toggle icon="bold" label="Bold" color="primary" />
          </StoryItem>
          <StoryItem label="primary pressed">
            <Toggle icon="bold" label="Bold" color="primary" pressed />
          </StoryItem>
          <StoryItem label="primary subtle">
            <Toggle icon="bold" label="Bold" color="primary" variant="subtle" />
          </StoryItem>
          <StoryItem label="primary subtle pressed">
            <Toggle icon="bold" label="Bold" color="primary" variant="subtle" pressed />
          </StoryItem>
        </StoryRow>
      </StorySection>


      {/* --------------------------------------------------------
          CONTROLLED
      -------------------------------------------------------- */}
      <StorySection title="Controlled" description="Manage pressed state externally via pressed and onPressedChange.">
        <StoryRow>
          <StoryItem label={`pressed: ${pressed}`}>
            <Toggle
              icon="bold"
              label="Bold"
              pressed={pressed}
              onPressedChange={setPressed}
            />
          </StoryItem>
        </StoryRow>
      </StorySection>


      {/* --------------------------------------------------------
          DISABLED
      -------------------------------------------------------- */}
      <StorySection title="Disabled">
        <StoryRow>
          <StoryItem label="default">
            <Toggle icon="bold" label="Bold" disabled />
          </StoryItem>
          <StoryItem label="pressed + disabled">
            <Toggle icon="bold" label="Bold" pressed disabled />
          </StoryItem>
        </StoryRow>
      </StorySection>

    </Story>
  );
};
