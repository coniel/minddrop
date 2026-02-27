/**
 * Slider.stories.tsx
 * Dev reference for the Slider component.
 */

import { useState } from 'react';
import { Slider } from './Slider';
import { Story, StorySection, StoryRow, StoryItem } from '../dev/Story';

export const SliderStories = () => {
  const [value, setValue] = useState(40);

  return (
    <Story title="Slider">

      {/* --------------------------------------------------------
          SIZES
      -------------------------------------------------------- */}
      <StorySection title="Sizes" description="sm / md (default). Track height: 2px / 4px.">
        <StoryRow>
          <StoryItem label="sm">
            <div style={{ width: 200 }}>
              <Slider size="sm" defaultValue={30} />
            </div>
          </StoryItem>
          <StoryItem label="md (default)">
            <div style={{ width: 200 }}>
              <Slider size="md" defaultValue={60} />
            </div>
          </StoryItem>
        </StoryRow>
      </StorySection>


      {/* --------------------------------------------------------
          CONTROLLED
      -------------------------------------------------------- */}
      <StorySection title="Controlled" description="Manage value state externally via value and onValueChange.">
        <StoryRow>
          <StoryItem label={`value: ${value}`}>
            <div style={{ width: 200 }}>
              <Slider
                value={value}
                onValueChange={(nextValue) => setValue(nextValue as number)}
              />
            </div>
          </StoryItem>
        </StoryRow>
      </StorySection>


      {/* --------------------------------------------------------
          MIN / MAX / STEP
      -------------------------------------------------------- */}
      <StorySection title="Min / Max / Step" description="Custom range and step increment.">
        <StoryRow>
          <StoryItem label="0–10, step 1">
            <div style={{ width: 200 }}>
              <Slider min={0} max={10} step={1} defaultValue={5} />
            </div>
          </StoryItem>
          <StoryItem label="0–1, step 0.1">
            <div style={{ width: 200 }}>
              <Slider min={0} max={1} step={0.1} defaultValue={0.5} />
            </div>
          </StoryItem>
        </StoryRow>
      </StorySection>


      {/* --------------------------------------------------------
          DISABLED
      -------------------------------------------------------- */}
      <StorySection title="Disabled">
        <StoryRow>
          <StoryItem label="disabled">
            <div style={{ width: 200 }}>
              <Slider disabled defaultValue={50} />
            </div>
          </StoryItem>
        </StoryRow>
      </StorySection>

    </Story>
  );
};
