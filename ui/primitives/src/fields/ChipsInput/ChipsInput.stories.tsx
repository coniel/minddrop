import React, { useState } from 'react';
import { registerStory } from '@minddrop/dev-tools';
import { normalizeFileExtension } from '@minddrop/utils';
/**
 * ChipsInput.stories.tsx
 * Dev reference for the ChipsInput primitive.
 */
import { Story, StoryItem, StoryRow, StorySection } from '../../dev/Story';
import { ChipsInput, ChipsInputProps } from './ChipsInput';

/* ============================================================
   SHARED DATA
   ============================================================ */

const EXTENSIONS = ['epub', 'mobi', 'azw3'];

const DOMAINS = ['wikipedia.org', 'github.com'];

const MANY_EXTENSIONS = [
  'epub',
  'mobi',
  'azw3',
  'fb2',
  'djvu',
  'cbz',
  'cbr',
  'lit',
  'lrf',
  'pdb',
];

// Extensions the validation examples reject
const TAKEN_EXTENSIONS = ['png', 'jpg', 'pdf'];

/* ============================================================
   STORIES
   ============================================================ */

export const ChipsInputStories = () => (
  <Story title="ChipsInput">
    {/* --------------------------------------------------------
        DEFAULT
    -------------------------------------------------------- */}
    <StorySection
      title="Default"
      description="Type a value and press Enter or comma, or blur the input, to add it as a chip. Backspace in the empty input removes the last chip."
    >
      <StoryRow>
        <StoryItem label="empty">
          <div style={{ width: 300 }}>
            <ChipsInputExample stringPlaceholder="epub, mobi" />
          </div>
        </StoryItem>
        <StoryItem label="with chips">
          <div style={{ width: 300 }}>
            <ChipsInputExample
              initialValue={EXTENSIONS}
              stringPlaceholder="epub, mobi"
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        VARIANTS
    -------------------------------------------------------- */}
    <StorySection
      title="Variants"
      description="subtle | outline | filled. Match TextInput variants."
    >
      <StoryRow>
        <StoryItem label="subtle">
          <div style={{ width: 300 }}>
            <ChipsInputExample variant="subtle" initialValue={EXTENSIONS} />
          </div>
        </StoryItem>
        <StoryItem label="outline (default)">
          <div style={{ width: 300 }}>
            <ChipsInputExample variant="outline" initialValue={EXTENSIONS} />
          </div>
        </StoryItem>
        <StoryItem label="filled">
          <div style={{ width: 300 }}>
            <ChipsInputExample variant="filled" initialValue={EXTENSIONS} />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        SIZES
    -------------------------------------------------------- */}
    <StorySection
      title="Sizes"
      description="md | lg. The height before the chips wrap matches TextInput."
    >
      <StoryRow>
        <StoryItem label="md">
          <div style={{ width: 300 }}>
            <ChipsInputExample size="md" initialValue={EXTENSIONS} />
          </div>
        </StoryItem>
        <StoryItem label="lg (default)">
          <div style={{ width: 300 }}>
            <ChipsInputExample size="lg" initialValue={EXTENSIONS} />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        SPLIT ON SPACE
    -------------------------------------------------------- */}
    <StorySection
      title="Split on space"
      description="For values which never contain a space. Space also adds a chip, and pasted text is split on spaces as well as commas."
    >
      <StoryRow>
        <StoryItem label="domains">
          <div style={{ width: 300 }}>
            <ChipsInputExample
              splitOnSpace
              initialValue={DOMAINS}
              stringPlaceholder="wikipedia.org"
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        NORMALIZE AND VALIDATE
    -------------------------------------------------------- */}
    <StorySection
      title="Normalize and validate"
      description={`Typed values are normalized before they are added. Here a leading dot is stripped and the value lowercased, so ".EPUB" adds "epub". A rejected value stays in the input. Here ${TAKEN_EXTENSIONS.join(', ')} are rejected.`}
    >
      <StoryRow>
        <StoryItem label="extensions">
          <div style={{ width: 300 }}>
            <ChipsInputExample
              splitOnSpace
              normalize={normalizeFileExtension}
              validate={isFreeExtension}
              stringPlaceholder="Try .EPUB or png"
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        OVERFLOW
    -------------------------------------------------------- */}
    <StorySection
      title="Overflow"
      description="Chips wrap onto new lines and the input grows with them."
    >
      <StoryRow>
        <StoryItem label="lg">
          <div style={{ width: 300 }}>
            <ChipsInputExample initialValue={MANY_EXTENSIONS} />
          </div>
        </StoryItem>
        <StoryItem label="md">
          <div style={{ width: 300 }}>
            <ChipsInputExample size="md" initialValue={MANY_EXTENSIONS} />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        STATES
    -------------------------------------------------------- */}
    <StorySection title="States" description="Invalid and disabled.">
      <StoryRow>
        <StoryItem label="invalid outline">
          <div style={{ width: 300 }}>
            <ChipsInputExample invalid initialValue={EXTENSIONS} />
          </div>
        </StoryItem>
        <StoryItem label="invalid subtle">
          <div style={{ width: 300 }}>
            <ChipsInputExample
              invalid
              variant="subtle"
              initialValue={EXTENSIONS}
            />
          </div>
        </StoryItem>
        <StoryItem label="disabled">
          <div style={{ width: 300 }}>
            <ChipsInputExample disabled initialValue={EXTENSIONS} />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>
  </Story>
);

/* --- ChipsInputExample ---
   Chips input which keeps its chips in local state. */

interface ChipsInputExampleProps
  extends Omit<ChipsInputProps, 'value' | 'onValueChange'> {
  /**
   * The chips the example starts with.
   */
  initialValue?: string[];
}

const ChipsInputExample: React.FC<ChipsInputExampleProps> = ({
  initialValue = [],
  ...other
}) => {
  const [value, setValue] = useState(initialValue);

  return <ChipsInput value={value} onValueChange={setValue} {...other} />;
};

/* --- isFreeExtension ---
   Checks whether an extension is not one of the taken ones. */

function isFreeExtension(extension: string): boolean {
  return !TAKEN_EXTENSIONS.includes(extension);
}

registerStory({
  group: 'Fields',
  label: 'ChipsInput',
  component: ChipsInputStories,
});
