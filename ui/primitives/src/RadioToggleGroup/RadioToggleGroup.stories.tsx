/**
 * RadioToggleGroup.stories.tsx
 * Dev reference for the RadioToggleGroup component.
 */

import { useState } from 'react';
import { Toggle } from '../Toggle';
import { RadioToggleGroup } from './RadioToggleGroup';
import { Story, StorySection, StoryRow, StoryItem } from '../dev/Story';

export const RadioToggleGroupStories = () => {
  const [align, setAlign] = useState('left');
  const [view, setView] = useState('grid');

  return (
    <Story title="RadioToggleGroup">

      {/* --------------------------------------------------------
          BASIC
          Single-select. Exactly one item is always active.
          Clicking the active item has no effect — it cannot
          be deselected. Use ToggleGroup for multi-select.
      -------------------------------------------------------- */}
      <StorySection title="Basic" description="Single-select — exactly one item is always active. Clicking the active toggle has no effect. Use ToggleGroup for multi-select.">
        <StoryRow>
          <StoryItem label="default">
            <RadioToggleGroup value={align} onValueChange={setAlign}>
              <Toggle value="left" icon="align-left" label="Align left" />
              <Toggle value="center" icon="align-center" label="Align center" />
              <Toggle value="right" icon="align-right" label="Align right" />
              <Toggle value="justify" icon="align-justify" label="Justify" />
            </RadioToggleGroup>
          </StoryItem>
          <StoryItem label="view switcher">
            <RadioToggleGroup value={view} onValueChange={setView}>
              <Toggle value="list" icon="list" label="List view" />
              <Toggle value="grid" icon="grid" label="Grid view" />
              <Toggle value="columns" icon="columns" label="Column view" />
            </RadioToggleGroup>
          </StoryItem>
        </StoryRow>
      </StorySection>


      {/* --------------------------------------------------------
          SIZES
      -------------------------------------------------------- */}
      <StorySection title="Sizes" description="Size is set on the container. Child Toggles are automatically sized down.">
        <StoryRow>
          <StoryItem label="sm">
            <RadioToggleGroup size="sm" defaultValue="left">
              <Toggle value="left" icon="align-left" label="Align left" />
              <Toggle value="center" icon="align-center" label="Align center" />
              <Toggle value="right" icon="align-right" label="Align right" />
            </RadioToggleGroup>
          </StoryItem>
          <StoryItem label="md (default)">
            <RadioToggleGroup size="md" defaultValue="left">
              <Toggle value="left" icon="align-left" label="Align left" />
              <Toggle value="center" icon="align-center" label="Align center" />
              <Toggle value="right" icon="align-right" label="Align right" />
            </RadioToggleGroup>
          </StoryItem>
          <StoryItem label="lg">
            <RadioToggleGroup size="lg" defaultValue="left">
              <Toggle value="left" icon="align-left" label="Align left" />
              <Toggle value="center" icon="align-center" label="Align center" />
              <Toggle value="right" icon="align-right" label="Align right" />
            </RadioToggleGroup>
          </StoryItem>
        </StoryRow>
      </StorySection>


      {/* --------------------------------------------------------
          UNCONTROLLED
      -------------------------------------------------------- */}
      <StorySection title="Uncontrolled" description="Use defaultValue when you don't need to track state externally.">
        <StoryRow>
          <StoryItem label="defaultValue='center'">
            <RadioToggleGroup defaultValue="center">
              <Toggle value="left" icon="align-left" label="Align left" />
              <Toggle value="center" icon="align-center" label="Align center" />
              <Toggle value="right" icon="align-right" label="Align right" />
            </RadioToggleGroup>
          </StoryItem>
        </StoryRow>
      </StorySection>


      {/* --------------------------------------------------------
          DISABLED
      -------------------------------------------------------- */}
      <StorySection title="Disabled">
        <StoryRow>
          <StoryItem label="group disabled">
            <RadioToggleGroup defaultValue="left" disabled>
              <Toggle value="left" icon="align-left" label="Align left" />
              <Toggle value="center" icon="align-center" label="Align center" />
              <Toggle value="right" icon="align-right" label="Align right" />
            </RadioToggleGroup>
          </StoryItem>
        </StoryRow>
      </StorySection>


      {/* --------------------------------------------------------
          IN USE
      -------------------------------------------------------- */}
      <StorySection title="In use" description="Common real-world patterns.">
        <StoryRow>
          <StoryItem label="toolbar alignment">
            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
              <RadioToggleGroup value={align} onValueChange={setAlign} size="sm">
                <Toggle value="left" icon="align-left" label="Left" />
                <Toggle value="center" icon="align-center" label="Center" />
                <Toggle value="right" icon="align-right" label="Right" />
              </RadioToggleGroup>
            </div>
          </StoryItem>
        </StoryRow>
      </StorySection>

    </Story>
  );
};
