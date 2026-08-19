/**
 * Slider.stories.tsx
 * Dev reference for the Slider component.
 */
import { useState } from 'react';
import { registerStory } from '@minddrop/dev-tools';
import { Story, StoryItem, StoryRow, StorySection } from '../dev/Story';
import { Slider } from './Slider';

export const SliderStories = () => {
  const [value, setValue] = useState(40);
  const [range, setRange] = useState([20, 80]);

  return (
    <Story title="Slider">
      {/* --------------------------------------------------------
          SIZES
      -------------------------------------------------------- */}
      <StorySection
        title="Sizes"
        description="sm / md (default). Track height: 2px / 4px."
      >
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
      <StorySection
        title="Controlled"
        description="Manage value state externally via value and onValueChange."
      >
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
          RANGE
      -------------------------------------------------------- */}
      <StorySection
        title="Range"
        description="Pass an array value to get one thumb per entry. The indicator fills between the thumbs."
      >
        <StoryRow>
          <StoryItem label="uncontrolled pair">
            <div style={{ width: 200 }}>
              <Slider defaultValue={[25, 75]} />
            </div>
          </StoryItem>
          <StoryItem label={`controlled: ${range.join('–')}`}>
            <div style={{ width: 200 }}>
              <Slider
                value={range}
                onValueChange={(nextValue) => setRange(nextValue as number[])}
              />
            </div>
          </StoryItem>
          <StoryItem label="three thumbs">
            <div style={{ width: 200 }}>
              <Slider defaultValue={[10, 50, 90]} />
            </div>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          MIN / MAX / STEP
      -------------------------------------------------------- */}
      <StorySection
        title="Min / Max / Step"
        description="Custom range and step increment."
      >
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

registerStory({
  group: 'Fields',
  label: 'Slider',
  component: SliderStories,
});
