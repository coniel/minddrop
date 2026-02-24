/**
 * Switch.stories.tsx
 * Dev reference for the Switch and SwitchField components.
 */

import { useState } from 'react';
import { Switch } from './Switch';
import { SwitchField } from './Switch';
import { Story, StorySection, StoryRow, StoryItem } from '../dev/Story';

export const SwitchStories = () => {
  const [checked, setChecked] = useState(false);

  return (
    <Story title="Switch">

      {/* --------------------------------------------------------
          SIZES
      -------------------------------------------------------- */}
      <StorySection title="Sizes" description="sm / md (default) / lg. Track height: 0.875rem / 1.125rem / 1.375rem.">
        <StoryRow>
          <StoryItem label="sm">
            <Switch size="sm" />
          </StoryItem>
          <StoryItem label="sm checked">
            <Switch size="sm" defaultChecked />
          </StoryItem>
          <StoryItem label="md (default)">
            <Switch size="md" />
          </StoryItem>
          <StoryItem label="md checked">
            <Switch size="md" defaultChecked />
          </StoryItem>
          <StoryItem label="lg">
            <Switch size="lg" />
          </StoryItem>
          <StoryItem label="lg checked">
            <Switch size="lg" defaultChecked />
          </StoryItem>
        </StoryRow>
      </StorySection>


      {/* --------------------------------------------------------
          CONTROLLED
      -------------------------------------------------------- */}
      <StorySection title="Controlled" description="Manage checked state externally via checked and onCheckedChange.">
        <StoryRow>
          <StoryItem label={`checked: ${checked}`}>
            <Switch
              checked={checked}
              onCheckedChange={setChecked}
            />
          </StoryItem>
        </StoryRow>
      </StorySection>


      {/* --------------------------------------------------------
          DISABLED
      -------------------------------------------------------- */}
      <StorySection title="Disabled">
        <StoryRow>
          <StoryItem label="unchecked">
            <Switch disabled />
          </StoryItem>
          <StoryItem label="checked">
            <Switch disabled defaultChecked />
          </StoryItem>
        </StoryRow>
      </StorySection>


      {/* --------------------------------------------------------
          SWITCH FIELD
          Switch paired with label and optional description.
          Clicking the label toggles the switch via Field.Root.
      -------------------------------------------------------- */}
      <StorySection title="SwitchField" description="Pairs Switch with a label and optional description. Clicking the label toggles the switch.">
        <StoryRow>
          <StoryItem label="label only">
            <SwitchField label="Enable notifications" />
          </StoryItem>
          <StoryItem label="label + description">
            <SwitchField
              label="Enable notifications"
              description="Receive updates about activity on your account."
              defaultChecked
            />
          </StoryItem>
        </StoryRow>
        <StoryRow>
          <StoryItem label="sm">
            <SwitchField
              size="sm"
              label="Compact switch"
              description="A smaller switch for dense layouts."
            />
          </StoryItem>
          <StoryItem label="lg">
            <SwitchField
              size="lg"
              label="Large switch"
              description="A larger switch for prominent settings."
              defaultChecked
            />
          </StoryItem>
        </StoryRow>
        <StoryRow>
          <StoryItem label="disabled">
            <SwitchField
              label="Auto-save"
              description="Automatically save changes as you work."
              disabled
              defaultChecked
            />
          </StoryItem>
        </StoryRow>
      </StorySection>

    </Story>
  );
};
