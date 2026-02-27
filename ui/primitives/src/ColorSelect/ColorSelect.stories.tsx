/**
 * ColorSelect.stories.tsx
 * Dev reference for the ColorSelect component.
 */

import { useState } from 'react';
import { ContentColor } from '@minddrop/theme';
import { ColorSelect } from './ColorSelect';
import { Story, StorySection, StoryRow, StoryItem } from '../dev/Story';

const Controlled = ({
  variant,
  size,
}: {
  variant?: 'ghost' | 'subtle' | 'outline' | 'filled';
  size?: 'sm' | 'md' | 'lg';
}) => {
  const [value, setValue] = useState<ContentColor>('blue');

  return (
    <ColorSelect
      variant={variant}
      size={size}
      value={value}
      onValueChange={setValue}
    />
  );
};

export const ColorSelectStories = () => (
  <Story title="ColorSelect">
    <StorySection
      title="Variants"
      description="Mirrors Select/Button variants. Default is 'outline'."
    >
      <StoryRow>
        <StoryItem label="ghost">
          <Controlled variant="ghost" />
        </StoryItem>
        <StoryItem label="subtle">
          <Controlled variant="subtle" />
        </StoryItem>
        <StoryItem label="outline (default)">
          <Controlled variant="outline" />
        </StoryItem>
        <StoryItem label="filled">
          <Controlled variant="filled" />
        </StoryItem>
      </StoryRow>
    </StorySection>

    <StorySection
      title="Sizes"
      description="Matches Button/Select sizes exactly."
    >
      <StoryRow>
        <StoryItem label="sm">
          <Controlled variant="outline" size="sm" />
        </StoryItem>
        <StoryItem label="md (default)">
          <Controlled variant="outline" size="md" />
        </StoryItem>
        <StoryItem label="lg">
          <Controlled variant="outline" size="lg" />
        </StoryItem>
      </StoryRow>
    </StorySection>

    <StorySection
      title="Colors"
      description="Shows all available content colors with swatches in the dropdown."
    >
      <StoryRow>
        <StoryItem label="default color">
          <ColorSelect value="default" />
        </StoryItem>
        <StoryItem label="red">
          <ColorSelect value="red" />
        </StoryItem>
        <StoryItem label="purple">
          <ColorSelect value="purple" />
        </StoryItem>
      </StoryRow>
    </StorySection>
  </Story>
);
