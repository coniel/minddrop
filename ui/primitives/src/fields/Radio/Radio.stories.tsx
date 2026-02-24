/**
 * Radio.stories.tsx
 * Dev reference for RadioField, RadioGroup, RadioCard, and RadioCardGroup.
 */
import { useState } from 'react';
import { Story, StoryItem, StoryRow, StorySection } from '../../dev/Story';
import { RadioCard, RadioCardGroup, RadioField, RadioGroup } from '../Radio';

export const RadioStories = () => {
  const [plan, setPlan] = useState('monthly');
  const [theme, setTheme] = useState('system');
  const [cardOutline, setCardOutline] = useState('pro');
  const [cardSubtle, setCardSubtle] = useState('pro');

  return (
    <Story title="Radio">
      {/* --------------------------------------------------------
          RADIO FIELD
          Always used inside a RadioGroup — the group manages
          which value is selected.
      -------------------------------------------------------- */}
      <StorySection
        title="RadioField"
        description="Always place RadioField inside a RadioGroup. The group manages selection state via the Base UI RadioGroup primitive."
      >
        <StoryRow>
          <StoryItem label="basic group">
            <RadioGroup value={plan} onValueChange={setPlan}>
              <RadioField value="monthly" label="Monthly billing" />
              <RadioField value="annual" label="Annual billing" />
              <RadioField value="lifetime" label="Lifetime" />
            </RadioGroup>
          </StoryItem>
          <StoryItem label="with descriptions">
            <RadioGroup value={plan} onValueChange={setPlan}>
              <RadioField
                value="monthly"
                label="Monthly billing"
                description="Billed every month, cancel anytime."
              />
              <RadioField
                value="annual"
                label="Annual billing"
                description="Billed once per year, save 20%."
              />
            </RadioGroup>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          WITH LABEL
          Group label rendered above the options.
      -------------------------------------------------------- */}
      <StorySection
        title="With label"
        description="Pass label to RadioGroup to render a group heading above the options."
      >
        <StoryRow>
          <StoryItem label="group label">
            <RadioGroup
              label="Billing period"
              value={plan}
              onValueChange={setPlan}
            >
              <RadioField value="monthly" label="Monthly" />
              <RadioField value="annual" label="Annual" />
              <RadioField value="lifetime" label="Lifetime" />
            </RadioGroup>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          DISABLED
      -------------------------------------------------------- */}
      <StorySection
        title="Disabled"
        description="Pass disabled to RadioGroup to disable all options. Individual RadioFields can also be disabled independently."
      >
        <StoryRow>
          <StoryItem label="group disabled">
            <RadioGroup value="monthly" onValueChange={() => {}} disabled>
              <RadioField value="monthly" label="Monthly" />
              <RadioField value="annual" label="Annual" />
              <RadioField value="lifetime" label="Lifetime" />
            </RadioGroup>
          </StoryItem>
          <StoryItem label="individual disabled">
            <RadioGroup value={plan} onValueChange={setPlan}>
              <RadioField value="monthly" label="Monthly" />
              <RadioField value="annual" label="Annual" />
              <RadioField
                value="lifetime"
                label="Lifetime (sold out)"
                disabled
              />
            </RadioGroup>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          RADIO CARD — OUTLINE
          Bordered card, fills with primary tint when selected.
          Best for prominent choices like plan selection.
      -------------------------------------------------------- */}
      <StorySection
        title="RadioCard — outline"
        description="Bordered card that fills with a primary tint when selected. Best for prominent choices like plan or mode selection."
      >
        <StoryRow>
          <StoryItem label="vertical (default)">
            <div style={{ width: 320 }}>
              <RadioCardGroup
                value={cardOutline}
                onValueChange={setCardOutline}
              >
                <RadioCard
                  value="starter"
                  variant="outline"
                  title="Starter"
                  description="For individuals and small projects."
                />
                <RadioCard
                  value="pro"
                  variant="outline"
                  title="Pro"
                  description="For growing teams with advanced needs."
                />
                <RadioCard
                  value="enterprise"
                  variant="outline"
                  title="Enterprise"
                  description="Custom pricing for large organisations."
                />
              </RadioCardGroup>
            </div>
          </StoryItem>
          <StoryItem label="horizontal">
            <div style={{ width: 480 }}>
              <RadioCardGroup
                value={cardOutline}
                onValueChange={setCardOutline}
                direction="horizontal"
              >
                <RadioCard
                  value="starter"
                  variant="outline"
                  title="Starter"
                  description="For individuals."
                />
                <RadioCard
                  value="pro"
                  variant="outline"
                  title="Pro"
                  description="For teams."
                />
                <RadioCard
                  value="enterprise"
                  variant="outline"
                  title="Enterprise"
                  description="Custom."
                />
              </RadioCardGroup>
            </div>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          RADIO CARD — SUBTLE
          Surface-filled card, stronger tint when selected.
          Sits more quietly in layouts with other content.
      -------------------------------------------------------- */}
      <StorySection
        title="RadioCard — subtle"
        description="Surface-filled card that uses a stronger primary tint when selected. Less visually dominant than outline."
      >
        <StoryRow>
          <StoryItem label="subtle">
            <div style={{ width: 320 }}>
              <RadioCardGroup value={cardSubtle} onValueChange={setCardSubtle}>
                <RadioCard
                  value="system"
                  variant="subtle"
                  title="System"
                  description="Follows your device appearance setting."
                />
                <RadioCard
                  value="light"
                  variant="subtle"
                  title="Light"
                  description="Always use the light theme."
                />
                <RadioCard
                  value="dark"
                  variant="subtle"
                  title="Dark"
                  description="Always use the dark theme."
                />
              </RadioCardGroup>
            </div>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          RADIO CARD — WITH ICON
          Icon sits above the title inside the card content area.
      -------------------------------------------------------- */}
      <StorySection
        title="RadioCard — with icon"
        description="Pass any React node as icon. Renders above the title in the card content area."
      >
        <StoryRow>
          <StoryItem label="with icons">
            <div style={{ width: 400 }}>
              <RadioCardGroup
                value={theme}
                onValueChange={setTheme}
                direction="horizontal"
              >
                <RadioCard
                  value="system"
                  variant="outline"
                  title="System"
                  description="Follow device setting"
                  icon={
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <path d="M8 21h8M12 17v4" />
                    </svg>
                  }
                />
                <RadioCard
                  value="light"
                  variant="outline"
                  title="Light"
                  description="Always light"
                  icon={
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                    </svg>
                  }
                />
                <RadioCard
                  value="dark"
                  variant="outline"
                  title="Dark"
                  description="Always dark"
                  icon={
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  }
                />
              </RadioCardGroup>
            </div>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          DISABLED CARD GROUP
      -------------------------------------------------------- */}
      <StorySection
        title="Disabled"
        description="Pass disabled to RadioCardGroup to disable all cards."
      >
        <StoryRow>
          <StoryItem label="disabled group">
            <div style={{ width: 320 }}>
              <RadioCardGroup value="pro" onValueChange={() => {}} disabled>
                <RadioCard
                  value="starter"
                  variant="outline"
                  title="Starter"
                  description="For individuals."
                />
                <RadioCard
                  value="pro"
                  variant="outline"
                  title="Pro"
                  description="For teams."
                />
              </RadioCardGroup>
            </div>
          </StoryItem>
        </StoryRow>
      </StorySection>
    </Story>
  );
};
