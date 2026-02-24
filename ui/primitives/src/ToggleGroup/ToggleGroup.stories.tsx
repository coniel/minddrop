/**
 * ToggleGroup.stories.tsx
 * Dev reference for the ToggleGroup component.
 */

import { useState } from 'react';
import { Toggle } from '../Toggle';
import { ToggleGroup } from './ToggleGroup';
import { Story, StorySection, StoryRow, StoryItem } from '../dev/Story';

export const ToggleGroupStories = () => {
  const [formatting, setFormatting] = useState<string[]>(['bold']);
  const [empty, setEmpty] = useState<string[]>([]);

  return (
    <Story title="ToggleGroup">

      {/* --------------------------------------------------------
          BASIC
          Multi-select. Any number of items can be active at once.
          Container size controls both container and child Toggle
          sizes — child Toggles are slightly smaller than their
          standalone equivalents to leave breathing room.
      -------------------------------------------------------- */}
      <StorySection title="Basic" description="Multi-select — any number of items can be active simultaneously. Use RadioToggleGroup for single-select/radio behaviour.">
        <StoryRow>
          <StoryItem label="default">
            <ToggleGroup value={formatting} onValueChange={setFormatting}>
              <Toggle value="bold" icon="bold" label="Bold" />
              <Toggle value="italic" icon="italic" label="Italic" />
              <Toggle value="underline" icon="underline" label="Underline" />
            </ToggleGroup>
          </StoryItem>
          <StoryItem label="none selected">
            <ToggleGroup value={empty} onValueChange={setEmpty}>
              <Toggle value="bold" icon="bold" label="Bold" />
              <Toggle value="italic" icon="italic" label="Italic" />
              <Toggle value="underline" icon="underline" label="Underline" />
            </ToggleGroup>
          </StoryItem>
          <StoryItem label="all selected">
            <ToggleGroup value={['bold', 'italic', 'underline']} onValueChange={() => {}}>
              <Toggle value="bold" icon="bold" label="Bold" />
              <Toggle value="italic" icon="italic" label="Italic" />
              <Toggle value="underline" icon="underline" label="Underline" />
            </ToggleGroup>
          </StoryItem>
        </StoryRow>
      </StorySection>


      {/* --------------------------------------------------------
          SIZES
          Size is set on the group container, not on each Toggle.
          Child Toggles are automatically sized down to fit.
      -------------------------------------------------------- */}
      <StorySection title="Sizes" description="Size is set on the container. Child Toggles are automatically sized down to leave breathing room inside the group.">
        <StoryRow>
          <StoryItem label="sm">
            <ToggleGroup size="sm" defaultValue={['bold']}>
              <Toggle value="bold" icon="bold" label="Bold" />
              <Toggle value="italic" icon="italic" label="Italic" />
              <Toggle value="underline" icon="underline" label="Underline" />
            </ToggleGroup>
          </StoryItem>
          <StoryItem label="md (default)">
            <ToggleGroup size="md" defaultValue={['bold']}>
              <Toggle value="bold" icon="bold" label="Bold" />
              <Toggle value="italic" icon="italic" label="Italic" />
              <Toggle value="underline" icon="underline" label="Underline" />
            </ToggleGroup>
          </StoryItem>
          <StoryItem label="lg">
            <ToggleGroup size="lg" defaultValue={['bold']}>
              <Toggle value="bold" icon="bold" label="Bold" />
              <Toggle value="italic" icon="italic" label="Italic" />
              <Toggle value="underline" icon="underline" label="Underline" />
            </ToggleGroup>
          </StoryItem>
        </StoryRow>
      </StorySection>


      {/* --------------------------------------------------------
          UNCONTROLLED
      -------------------------------------------------------- */}
      <StorySection title="Uncontrolled" description="Use defaultValue when you don't need to track state externally.">
        <StoryRow>
          <StoryItem label="defaultValue">
            <ToggleGroup defaultValue={['italic']}>
              <Toggle value="bold" icon="bold" label="Bold" />
              <Toggle value="italic" icon="italic" label="Italic" />
              <Toggle value="underline" icon="underline" label="Underline" />
            </ToggleGroup>
          </StoryItem>
        </StoryRow>
      </StorySection>


      {/* --------------------------------------------------------
          DISABLED
      -------------------------------------------------------- */}
      <StorySection title="Disabled">
        <StoryRow>
          <StoryItem label="group disabled">
            <ToggleGroup defaultValue={['bold']} disabled>
              <Toggle value="bold" icon="bold" label="Bold" />
              <Toggle value="italic" icon="italic" label="Italic" />
              <Toggle value="underline" icon="underline" label="Underline" />
            </ToggleGroup>
          </StoryItem>
        </StoryRow>
      </StorySection>

    </Story>
  );
};
