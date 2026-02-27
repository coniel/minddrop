/**
 * NumberField.stories.tsx
 * Dev reference for the NumberField component.
 */
import { useState } from 'react';
import { Story, StoryItem, StoryRow, StorySection } from '../dev/Story';
import { NumberField } from './NumberField';

export const NumberFieldStories = () => {
  const [value, setValue] = useState<number | null>(42);

  return (
    <Story title="NumberField">
      {/* --------------------------------------------------------
          VARIANTS
          Inherits text-field variant styles directly — no
          duplicate CSS. Stepper buttons appear on hover.
      -------------------------------------------------------- */}
      <StorySection
        title="Variants"
        description="Inherits all text-field variant styles. Stepper buttons appear on hover over the input."
      >
        <StoryRow>
          <StoryItem label="ghost">
            <div style={{ width: 160 }}>
              <NumberField variant="ghost" defaultValue={100} />
            </div>
          </StoryItem>
          <StoryItem label="subtle">
            <div style={{ width: 160 }}>
              <NumberField variant="subtle" defaultValue={100} />
            </div>
          </StoryItem>
          <StoryItem label="outline (default)">
            <div style={{ width: 160 }}>
              <NumberField variant="outline" defaultValue={100} />
            </div>
          </StoryItem>
          <StoryItem label="filled">
            <div style={{ width: 160 }}>
              <NumberField variant="filled" defaultValue={100} />
            </div>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          SIZES
      -------------------------------------------------------- */}
      <StorySection
        title="Sizes"
        description="Matches TextField/Button/Select sizes exactly. Triangle icons scale with size."
      >
        <StoryRow>
          <StoryItem label="sm">
            <div style={{ width: 140 }}>
              <NumberField size="sm" defaultValue={100} />
            </div>
          </StoryItem>
          <StoryItem label="md">
            <div style={{ width: 140 }}>
              <NumberField size="md" defaultValue={100} />
            </div>
          </StoryItem>
          <StoryItem label="lg (default)">
            <div style={{ width: 140 }}>
              <NumberField size="lg" defaultValue={100} />
            </div>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          LABEL
      -------------------------------------------------------- */}
      <StorySection
        title="Label"
        description="Uses FieldLabel above the input."
      >
        <StoryRow>
          <StoryItem label="with label">
            <div style={{ width: 180 }}>
              <NumberField label="Width" defaultValue={320} />
            </div>
          </StoryItem>
          <StoryItem label="with error">
            <div style={{ width: 180 }}>
              <NumberField
                label="Width"
                defaultValue={-5}
                min={0}
                error="Value must be 0 or greater."
              />
            </div>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          MIN / MAX
          Decrement disables at min, increment disables at max.
          Base UI manages data-disabled on the button elements.
      -------------------------------------------------------- */}
      <StorySection
        title="Min / max"
        description="Stepper buttons disable at boundaries. Base UI sets data-disabled automatically."
      >
        <StoryRow>
          <StoryItem label="min=0 max=100">
            <div style={{ width: 160 }}>
              <NumberField defaultValue={50} min={0} max={100} />
            </div>
          </StoryItem>
          <StoryItem label="at min (0)">
            <div style={{ width: 160 }}>
              <NumberField
                value={0}
                min={0}
                max={100}
                onValueChange={() => {}}
              />
            </div>
          </StoryItem>
          <StoryItem label="at max (100)">
            <div style={{ width: 160 }}>
              <NumberField
                value={100}
                min={0}
                max={100}
                onValueChange={() => {}}
              />
            </div>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          STEP
      -------------------------------------------------------- */}
      <StorySection
        title="Step"
        description="Controls the increment/decrement amount per click."
      >
        <StoryRow>
          <StoryItem label="step=1 (default)">
            <div style={{ width: 160 }}>
              <NumberField defaultValue={10} step={1} />
            </div>
          </StoryItem>
          <StoryItem label="step=5">
            <div style={{ width: 160 }}>
              <NumberField defaultValue={50} step={5} />
            </div>
          </StoryItem>
          <StoryItem label="step=0.1">
            <div style={{ width: 160 }}>
              <NumberField defaultValue={1.0} step={0.1} decimals={1} />
            </div>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          DECIMALS
      -------------------------------------------------------- */}
      <StorySection
        title="Decimals"
        description="decimals=0 for integers only. decimals=N for N decimal places. Undefined allows unrestricted decimals."
      >
        <StoryRow>
          <StoryItem label="decimals=0 (integers only)">
            <div style={{ width: 160 }}>
              <NumberField defaultValue={42} decimals={0} />
            </div>
          </StoryItem>
          <StoryItem label="decimals=1">
            <div style={{ width: 160 }}>
              <NumberField defaultValue={3.5} decimals={1} step={0.1} />
            </div>
          </StoryItem>
          <StoryItem label="decimals=2">
            <div style={{ width: 160 }}>
              <NumberField defaultValue={9.99} decimals={2} step={0.01} />
            </div>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          LEADING / TRAILING
          Trailing fades out when stepper buttons appear.
      -------------------------------------------------------- */}
      <StorySection
        title="Leading / trailing"
        description="Trailing element fades out on hover when stepper buttons appear. Stepper renders on top of trailing."
      >
        <StoryRow>
          <StoryItem label="leading prefix">
            <div style={{ width: 180 }}>
              <NumberField
                defaultValue={42}
                leading={
                  <span
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-subtle)',
                    }}
                  >
                    $
                  </span>
                }
              />
            </div>
          </StoryItem>
          <StoryItem label="trailing unit">
            <div style={{ width: 180 }}>
              <NumberField
                defaultValue={320}
                trailing={
                  <span
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-subtle)',
                    }}
                  >
                    px
                  </span>
                }
              />
            </div>
          </StoryItem>
          <StoryItem label="both">
            <div style={{ width: 200 }}>
              <NumberField
                defaultValue={9.99}
                decimals={2}
                leading={
                  <span
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-subtle)',
                    }}
                  >
                    $
                  </span>
                }
                trailing={
                  <span
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-subtle)',
                    }}
                  >
                    USD
                  </span>
                }
              />
            </div>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          CONTROLLED
      -------------------------------------------------------- */}
      <StorySection
        title="Controlled"
        description="Manage value externally via value and onValueChange."
      >
        <StoryRow>
          <StoryItem label={`value: ${value}`}>
            <div style={{ width: 160 }}>
              <NumberField
                value={value ?? undefined}
                onValueChange={setValue}
                min={0}
                max={100}
              />
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
            <div style={{ width: 160 }}>
              <NumberField defaultValue={42} disabled />
            </div>
          </StoryItem>
        </StoryRow>
      </StorySection>
    </Story>
  );
};
