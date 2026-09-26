import { registerStory } from '@minddrop/dev-tools';
import { SelectOption } from '../../Select';
/**
 * SelectField.stories.tsx
 * Dev reference for the SelectField primitive.
 */
import { Story, StoryItem, StoryRow, StorySection } from '../../dev/Story';
import { FieldValidate } from '../useFieldValidation';
import { SelectField } from './SelectField';

/* ============================================================
   SHARED DATA
   ============================================================ */

const SORT_OPTIONS: SelectOption<string>[] = [
  { stringLabel: 'Name', value: 'name' },
  { stringLabel: 'Date created', value: 'created' },
  { stringLabel: 'Date modified', value: 'modified' },
  { stringLabel: 'Size', value: 'size' },
];

const FORMAT_OPTIONS: SelectOption<string>[] = [
  { stringLabel: 'Markdown', value: 'markdown' },
  { stringLabel: 'JSON', value: 'json' },
  { stringLabel: 'YAML (coming soon)', value: 'yaml' },
];

/* ============================================================
   STORIES
   ============================================================ */

export const SelectFieldStories = () => (
  <Story title="SelectField">
    {/* --------------------------------------------------------
        DEFAULT
    -------------------------------------------------------- */}
    <StorySection
      title="Default"
      description="A Select with a label and a description or error, like TextField."
    >
      <StoryRow>
        <StoryItem label="label and description">
          <div style={{ width: 240 }}>
            <SelectField
              stringLabel="Sort by"
              stringDescription="Entries are listed in this order."
              options={SORT_OPTIONS}
              stringPlaceholder="Choose a property..."
            />
          </div>
        </StoryItem>
        <StoryItem label="with value">
          <div style={{ width: 240 }}>
            <SelectField
              stringLabel="Sort by"
              options={SORT_OPTIONS}
              value="created"
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
      description="ghost | subtle | outline | filled. Match Select."
    >
      <StoryRow>
        <StoryItem label="ghost">
          <div style={{ width: 200 }}>
            <SelectField
              variant="ghost"
              stringLabel="Sort by"
              options={SORT_OPTIONS}
              stringPlaceholder="Sort by..."
            />
          </div>
        </StoryItem>
        <StoryItem label="subtle">
          <div style={{ width: 200 }}>
            <SelectField
              variant="subtle"
              stringLabel="Sort by"
              options={SORT_OPTIONS}
              stringPlaceholder="Sort by..."
            />
          </div>
        </StoryItem>
        <StoryItem label="outline (default)">
          <div style={{ width: 200 }}>
            <SelectField
              stringLabel="Sort by"
              options={SORT_OPTIONS}
              stringPlaceholder="Sort by..."
            />
          </div>
        </StoryItem>
        <StoryItem label="filled">
          <div style={{ width: 200 }}>
            <SelectField
              variant="filled"
              stringLabel="Sort by"
              options={SORT_OPTIONS}
              stringPlaceholder="Sort by..."
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        SIZES
    -------------------------------------------------------- */}
    <StorySection title="Sizes" description="sm | md | lg (default).">
      <StoryRow>
        <StoryItem label="sm">
          <div style={{ width: 200 }}>
            <SelectField
              size="sm"
              stringLabel="Sort by"
              options={SORT_OPTIONS}
              stringPlaceholder="Sort by..."
            />
          </div>
        </StoryItem>
        <StoryItem label="md">
          <div style={{ width: 200 }}>
            <SelectField
              size="md"
              stringLabel="Sort by"
              options={SORT_OPTIONS}
              stringPlaceholder="Sort by..."
            />
          </div>
        </StoryItem>
        <StoryItem label="lg (default)">
          <div style={{ width: 200 }}>
            <SelectField
              stringLabel="Sort by"
              options={SORT_OPTIONS}
              stringPlaceholder="Sort by..."
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        LABEL SIZES
    -------------------------------------------------------- */}
    <StorySection
      title="Label sizes"
      description="Label sizes, matching the Text size scale. Default is 'sm'."
    >
      <StoryRow>
        <StoryItem label="xs">
          <div style={{ width: 200 }}>
            <SelectField
              labelSize="xs"
              label="collections.labels.collection"
              options={SORT_OPTIONS}
            />
          </div>
        </StoryItem>
        <StoryItem label="sm (default)">
          <div style={{ width: 200 }}>
            <SelectField
              labelSize="sm"
              label="collections.labels.collection"
              options={SORT_OPTIONS}
            />
          </div>
        </StoryItem>
        <StoryItem label="base">
          <div style={{ width: 200 }}>
            <SelectField
              labelSize="base"
              label="collections.labels.collection"
              options={SORT_OPTIONS}
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
      description="An error passed in by the consumer. It hides the description."
    >
      <StoryRow>
        <StoryItem label="stringError">
          <div style={{ width: 240 }}>
            <SelectField
              stringLabel="Sort by"
              stringDescription="Hidden while an error is shown."
              stringError="Choose a property to sort by"
              options={SORT_OPTIONS}
              stringPlaceholder="Sort by..."
            />
          </div>
        </StoryItem>
        <StoryItem label="error">
          <div style={{ width: 240 }}>
            <SelectField
              stringLabel="Sort by"
              error="formErrors.required"
              options={SORT_OPTIONS}
              stringPlaceholder="Sort by..."
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
      description="validate runs as each value is selected. Select YAML to see the error. It shows until an accepted value is selected, and takes priority over the error props."
    >
      <StoryRow>
        <StoryItem label="plain string">
          <div style={{ width: 240 }}>
            <SelectField
              stringLabel="Entry format"
              options={FORMAT_OPTIONS}
              stringPlaceholder="Choose a format..."
              validate={validateFormat}
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>
  </Story>
);

/* --- validateFormat ---
   Rejects the unavailable format, by plain string. */

const validateFormat: FieldValidate<string | number> = (value) =>
  value === 'yaml' ? { string: 'YAML is not available yet' } : false;

registerStory({
  group: 'Fields',
  label: 'SelectField',
  component: SelectFieldStories,
});
