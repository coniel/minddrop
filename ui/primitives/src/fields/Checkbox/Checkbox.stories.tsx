/**
 * Checkbox.stories.tsx
 * Dev reference for Checkbox, CheckboxField, and CheckboxGroup.
 */
import { useState } from 'react';
import { Story, StoryItem, StoryRow, StorySection } from '../../dev/Story';
import { CheckboxField, CheckboxGroup } from './Checkbox';

const OPTIONS = ['Option A', 'Option B', 'Option C', 'Option D'];

export const CheckboxStories = () => {
  const [single, setSingle] = useState(false);
  const [grouped, setGrouped] = useState<string[]>(['Option A', 'Option C']);

  return (
    <Story title="Checkbox">
      {/* --------------------------------------------------------
          BASIC
          CheckboxField is the primary way to use checkboxes.
          Always renders within a Field.Root for accessibility.
      -------------------------------------------------------- */}
      <StorySection
        title="Basic"
        description="CheckboxField wires the indicator and label together via Field.Root. Always use CheckboxField over the raw Checkbox primitive."
      >
        <StoryRow>
          <StoryItem label="unchecked">
            <CheckboxField label="Enable notifications" />
          </StoryItem>
          <StoryItem label="checked">
            <CheckboxField label="Enable notifications" checked />
          </StoryItem>
          <StoryItem label="indeterminate">
            <CheckboxField label="Enable notifications" indeterminate />
          </StoryItem>
          <StoryItem label="disabled">
            <CheckboxField label="Enable notifications" disabled />
          </StoryItem>
          <StoryItem label="disabled + checked">
            <CheckboxField label="Enable notifications" checked disabled />
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          WITH DESCRIPTION
          Optional helper text rendered below the label.
      -------------------------------------------------------- */}
      <StorySection
        title="With description"
        description="Helper text appears below the label and links to the field via Field.Description."
      >
        <StoryRow>
          <StoryItem label="label + description">
            <div style={{ width: 320 }}>
              <CheckboxField
                label="Marketing emails"
                description="Receive emails about new features, product updates, and announcements."
              />
            </div>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          CONTROLLED
          Controlled checked state via checked + onCheckedChange.
      -------------------------------------------------------- */}
      <StorySection
        title="Controlled"
        description="Manage checked state externally via checked and onCheckedChange."
      >
        <StoryRow>
          <StoryItem label={`checked: ${single}`}>
            <CheckboxField
              label="Toggle me"
              checked={single}
              onCheckedChange={setSingle}
            />
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          CHECKBOX GROUP
          Manages multiple related checkboxes via context.
          Each CheckboxField needs a value prop to participate.
      -------------------------------------------------------- */}
      <StorySection
        title="CheckboxGroup"
        description="Manages checked state across related checkboxes via context. Each item needs a value prop."
      >
        <StoryRow>
          <StoryItem label="basic group">
            <CheckboxGroup value={grouped} onChange={setGrouped}>
              {OPTIONS.map((o) => (
                <CheckboxField key={o} value={o} label={o} />
              ))}
            </CheckboxGroup>
          </StoryItem>
          <StoryItem label="with label">
            <CheckboxGroup
              label="Notifications"
              value={grouped}
              onChange={setGrouped}
            >
              {OPTIONS.map((o) => (
                <CheckboxField key={o} value={o} label={o} />
              ))}
            </CheckboxGroup>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          SELECT ALL
          Renders a "select all" checkbox above the group that
          auto-manages indeterminate state. Requires options prop.
      -------------------------------------------------------- */}
      <StorySection
        title="Select all"
        description="Pass selectAll and options to get an auto-managed select-all checkbox. The indicator is indeterminate when some but not all are checked."
      >
        <StoryRow>
          <StoryItem label="select all">
            <CheckboxGroup
              label="Permissions"
              value={grouped}
              onChange={setGrouped}
              options={OPTIONS}
              selectAll
            >
              {OPTIONS.map((o) => (
                <CheckboxField key={o} value={o} label={o} />
              ))}
            </CheckboxGroup>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          DISABLED GROUP
          Passing disabled to CheckboxGroup disables all children.
      -------------------------------------------------------- */}
      <StorySection
        title="Disabled group"
        description="Passing disabled to CheckboxGroup propagates to all children."
      >
        <StoryRow>
          <StoryItem label="disabled">
            <CheckboxGroup
              value={['Option A', 'Option C']}
              onChange={() => {}}
              disabled
            >
              {OPTIONS.map((o) => (
                <CheckboxField key={o} value={o} label={o} />
              ))}
            </CheckboxGroup>
          </StoryItem>
        </StoryRow>
      </StorySection>
    </Story>
  );
};
