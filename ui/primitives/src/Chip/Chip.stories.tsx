/**
 * Chip.stories.tsx
 * Dev reference for the Chip component.
 */
import { Story, StoryItem, StoryRow, StorySection } from '../dev/Story';
import { Chip } from './Chip';

export const ChipStories = () => (
  <Story title="Chip">
    {/* --------------------------------------------------------
        VARIANTS
        Two shape variants: rectangular (default) with a small
        border radius, and round with a pill shape.
    -------------------------------------------------------- */}
    <StorySection
      title="Variants"
      description="Rectangular is the default with a small border radius. Round uses a pill shape."
    >
      <StoryRow>
        <StoryItem label="rectangular (default)">
          <Chip>Label</Chip>
        </StoryItem>
        <StoryItem label="round">
          <Chip variant="round">Label</Chip>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        SIZES
        Three sizes for different density contexts.
    -------------------------------------------------------- */}
    <StorySection
      title="Sizes"
      description="Three sizes for different density contexts."
    >
      <StoryRow>
        <StoryItem label="sm">
          <Chip size="sm">Small</Chip>
        </StoryItem>
        <StoryItem label="md (default)">
          <Chip size="md">Medium</Chip>
        </StoryItem>
        <StoryItem label="lg">
          <Chip size="lg">Large</Chip>
        </StoryItem>
      </StoryRow>
      <StoryRow label="round">
        <StoryItem label="sm">
          <Chip variant="round" size="sm">
            Small
          </Chip>
        </StoryItem>
        <StoryItem label="md">
          <Chip variant="round" size="md">
            Medium
          </Chip>
        </StoryItem>
        <StoryItem label="lg">
          <Chip variant="round" size="lg">
            Large
          </Chip>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        CONTENT COLORS
        All available content color variants. Used for
        categorisation, tags, and status indicators.
    -------------------------------------------------------- */}
    <StorySection
      title="Content colors"
      description="All available content color variants for categorisation, tags, and status indicators."
    >
      <StoryRow>
        <StoryItem label="default">
          <Chip>Default</Chip>
        </StoryItem>
        <StoryItem label="blue">
          <Chip color="blue">Blue</Chip>
        </StoryItem>
        <StoryItem label="cyan">
          <Chip color="cyan">Cyan</Chip>
        </StoryItem>
        <StoryItem label="red">
          <Chip color="red">Red</Chip>
        </StoryItem>
        <StoryItem label="pink">
          <Chip color="pink">Pink</Chip>
        </StoryItem>
        <StoryItem label="purple">
          <Chip color="purple">Purple</Chip>
        </StoryItem>
        <StoryItem label="green">
          <Chip color="green">Green</Chip>
        </StoryItem>
        <StoryItem label="orange">
          <Chip color="orange">Orange</Chip>
        </StoryItem>
        <StoryItem label="yellow">
          <Chip color="yellow">Yellow</Chip>
        </StoryItem>
        <StoryItem label="brown">
          <Chip color="brown">Brown</Chip>
        </StoryItem>
        <StoryItem label="gray">
          <Chip color="gray">Gray</Chip>
        </StoryItem>
      </StoryRow>
      <StoryRow label="round">
        <StoryItem label="default">
          <Chip variant="round">Default</Chip>
        </StoryItem>
        <StoryItem label="blue">
          <Chip variant="round" color="blue">
            Blue
          </Chip>
        </StoryItem>
        <StoryItem label="cyan">
          <Chip variant="round" color="cyan">
            Cyan
          </Chip>
        </StoryItem>
        <StoryItem label="red">
          <Chip variant="round" color="red">
            Red
          </Chip>
        </StoryItem>
        <StoryItem label="pink">
          <Chip variant="round" color="pink">
            Pink
          </Chip>
        </StoryItem>
        <StoryItem label="purple">
          <Chip variant="round" color="purple">
            Purple
          </Chip>
        </StoryItem>
        <StoryItem label="green">
          <Chip variant="round" color="green">
            Green
          </Chip>
        </StoryItem>
        <StoryItem label="orange">
          <Chip variant="round" color="orange">
            Orange
          </Chip>
        </StoryItem>
        <StoryItem label="yellow">
          <Chip variant="round" color="yellow">
            Yellow
          </Chip>
        </StoryItem>
        <StoryItem label="brown">
          <Chip variant="round" color="brown">
            Brown
          </Chip>
        </StoryItem>
        <StoryItem label="gray">
          <Chip variant="round" color="gray">
            Gray
          </Chip>
        </StoryItem>
      </StoryRow>
    </StorySection>
  </Story>
);
