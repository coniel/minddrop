import React, { useState } from 'react';
import { registerStory } from '@minddrop/dev-tools';
import { normalizeFileExtension } from '@minddrop/utils';
/**
 * ChipsField.stories.tsx
 * Dev reference for the ChipsField primitive.
 */
import { Story, StoryItem, StoryRow, StorySection } from '../../dev/Story';
import { FieldValidationError } from '../useFieldValidation';
import { ChipsField, ChipsFieldProps } from './ChipsField';

/* ============================================================
   SHARED DATA
   ============================================================ */

const EXTENSIONS = ['epub', 'mobi', 'azw3'];

// Extensions the validation example rejects
const TAKEN_EXTENSIONS = ['png', 'jpg', 'pdf'];

// Characters a folder name cannot contain
const INVALID_NAME_CHARACTERS = /[/\\:*?"<>|]/;

/* ============================================================
   STORIES
   ============================================================ */

export const ChipsFieldStories = () => (
  <Story title="ChipsField">
    {/* --------------------------------------------------------
        DEFAULT
    -------------------------------------------------------- */}
    <StorySection
      title="Default"
      description="A ChipsInput with a label and a description or error, like TextField."
    >
      <StoryRow>
        <StoryItem label="label and description">
          <div style={{ width: 300 }}>
            <ChipsFieldExample
              stringLabel="File extensions"
              stringDescription="Files with these extensions are added to the database."
              initialValue={EXTENSIONS}
            />
          </div>
        </StoryItem>
        <StoryItem label="placeholder">
          <div style={{ width: 300 }}>
            <ChipsFieldExample
              splitOnSpace
              stringLabel="Domains"
              stringPlaceholder="wikipedia.org"
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        SIZES
    -------------------------------------------------------- */}
    <StorySection title="Sizes" description="md | lg. Match TextField.">
      <StoryRow>
        <StoryItem label="md">
          <div style={{ width: 300 }}>
            <ChipsFieldExample
              size="md"
              stringLabel="File extensions"
              initialValue={EXTENSIONS}
            />
          </div>
        </StoryItem>
        <StoryItem label="lg (default)">
          <div style={{ width: 300 }}>
            <ChipsFieldExample
              stringLabel="File extensions"
              initialValue={EXTENSIONS}
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        VALIDATION
    -------------------------------------------------------- */}
    <StorySection
      title="Validation"
      description="validate returns the error a typed value is rejected with, or false to accept it. The field shows the error and keeps the value in the input, and clears the error as soon as the text is edited."
    >
      <StoryRow>
        <StoryItem label="i18n key">
          <div style={{ width: 300 }}>
            <ChipsFieldExample
              splitOnSpace
              stringLabel="Folder names"
              stringPlaceholder='Try "a/b"'
              validate={validateFolderName}
            />
          </div>
        </StoryItem>
        <StoryItem label="i18n key with values">
          <div style={{ width: 300 }}>
            <ChipsFieldExample
              splitOnSpace
              stringLabel="File extensions"
              stringPlaceholder="Try png"
              normalize={normalizeFileExtension}
              validate={validateExtension}
            />
          </div>
        </StoryItem>
        <StoryItem label="plain string">
          <div style={{ width: 300 }}>
            <ChipsFieldExample
              splitOnSpace
              stringLabel="Domains"
              stringPlaceholder="Try localhost"
              validate={validateDomain}
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        ERROR PROP
    -------------------------------------------------------- */}
    <StorySection
      title="Error prop"
      description="An error passed in by the consumer. A validation error takes priority over it while shown."
    >
      <StoryRow>
        <StoryItem label="stringError">
          <div style={{ width: 300 }}>
            <ChipsFieldExample
              stringLabel="File extensions"
              stringDescription="Hidden while an error is shown."
              stringError="Add at least one extension"
            />
          </div>
        </StoryItem>
        <StoryItem label="error">
          <div style={{ width: 300 }}>
            <ChipsFieldExample
              stringLabel="File extensions"
              error="formErrors.required"
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>
  </Story>
);

/* --- ChipsFieldExample ---
   Chips field which keeps its chips in local state. */

interface ChipsFieldExampleProps
  extends Omit<ChipsFieldProps, 'value' | 'onValueChange'> {
  /**
   * The chips the example starts with.
   */
  initialValue?: string[];
}

const ChipsFieldExample: React.FC<ChipsFieldExampleProps> = ({
  initialValue = [],
  ...other
}) => {
  const [value, setValue] = useState(initialValue);

  return <ChipsField value={value} onValueChange={setValue} {...other} />;
};

/* --- validateFolderName ---
   Rejects a folder name with an invalid character, by i18n key. */

function validateFolderName(name: string): FieldValidationError | false {
  if (INVALID_NAME_CHARACTERS.test(name)) {
    return 'error.invalidDirName';
  }

  return false;
}

/* --- validateExtension ---
   Rejects a taken extension, by i18n key with values. */

function validateExtension(extension: string): FieldValidationError | false {
  if (TAKEN_EXTENSIONS.includes(extension)) {
    return {
      key: 'databases.settings.contentDefaults.custom.matcherTaken',
      values: { type: 'Images' },
    };
  }

  return false;
}

/* --- validateDomain ---
   Rejects a domain without a dot, by plain string. */

function validateDomain(domain: string): FieldValidationError | false {
  if (!domain.includes('.')) {
    return { string: `"${domain}" is not a domain` };
  }

  return false;
}

registerStory({
  group: 'Fields',
  label: 'ChipsField',
  component: ChipsFieldStories,
});
