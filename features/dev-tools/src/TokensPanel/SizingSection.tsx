import React from 'react';
import { ValueRow } from './ValueRow';

/**
 * Renders the sizing token values: spacing, radius, box sizes,
 * border widths and icon sizes.
 */
export const SizingSection: React.FC = () => (
  <div className="dev-tools-tokens-section">
    <h3 className="dev-tools-tokens-heading">Spacing</h3>

    <p className="dev-tools-tokens-hint">
      Steps resolve through --space-unit (4px), so a scoped unit override
      rescales them together.
    </p>

    <div className="dev-tools-tokens-group">
      {SpacingSteps.map((step) => (
        <ValueRow
          key={step.token}
          token={step.token}
          note={step.note}
          sample={
            <div
              className="dev-tools-tokens-bar"
              style={{ width: `var(${step.token})` }}
            />
          }
        />
      ))}
    </div>

    <h3 className="dev-tools-tokens-heading">Border radius</h3>

    <p className="dev-tools-tokens-hint">
      Steps resolve through --radius-unit (1px), so a scoped unit override
      rescales them together.
    </p>

    <div className="dev-tools-tokens-group">
      {RadiusSteps.map((step) => (
        <ValueRow
          key={step.token}
          token={step.token}
          note={step.note}
          sample={
            <div
              className="dev-tools-tokens-box"
              style={{ borderRadius: `var(${step.token})` }}
            />
          }
        />
      ))}
    </div>

    <h3 className="dev-tools-tokens-heading">Sizes</h3>

    <p className="dev-tools-tokens-hint">
      Coarse box sizes for content areas (covers, embeds). Fixed rem,
      deliberately unaffected by density.
    </p>

    <div className="dev-tools-tokens-group">
      {SizeSteps.map((step) => (
        <ValueRow
          key={step.token}
          token={step.token}
          note={step.note}
          sample={
            <div
              className="dev-tools-tokens-bar"
              style={{ width: `var(${step.token})` }}
            />
          }
        />
      ))}
    </div>

    <h3 className="dev-tools-tokens-heading">Border widths</h3>

    <div className="dev-tools-tokens-group">
      {BorderWidths.map((step) => (
        <ValueRow
          key={step.token}
          token={step.token}
          note={step.note}
          sample={
            <div
              className="dev-tools-tokens-border-sample"
              style={{
                borderTop: `var(${step.token}) solid var(--border-strong)`,
              }}
            />
          }
        />
      ))}
    </div>

    <h3 className="dev-tools-tokens-heading">Icon sizes</h3>

    <div className="dev-tools-tokens-group">
      {IconSizes.map((step) => (
        <ValueRow
          key={step.token}
          token={step.token}
          note={step.note}
          sample={<IconBox token={step.token} />}
        />
      ))}
    </div>
  </div>
);

interface SizingStep {
  /**
   * Name of the token.
   */
  token: string;

  /**
   * The token's resolved value.
   */
  note: string;
}

interface IconBoxProps {
  /**
   * Icon size token setting the box dimensions.
   */
  token: string;
}

/**
 * Renders a square sized by an icon size token.
 */
const IconBox: React.FC<IconBoxProps> = ({ token }) => (
  <div
    className="dev-tools-tokens-icon-box"
    style={{ width: `var(${token})`, height: `var(${token})` }}
  />
);

/**
 * The spacing scale.
 */
const SpacingSteps: SizingStep[] = [
  { token: '--space-px', note: '1px, fixed' },
  { token: '--space-0-5', note: '2px' },
  { token: '--space-0-75', note: '3px' },
  { token: '--space-1', note: '4px' },
  { token: '--space-1-5', note: '6px' },
  { token: '--space-2', note: '8px' },
  { token: '--space-3', note: '12px' },
  { token: '--space-4', note: '16px' },
  { token: '--space-5', note: '24px' },
  { token: '--space-6', note: '32px' },
  { token: '--space-7', note: '48px' },
  { token: '--space-8', note: '64px' },
];

/**
 * The border radius scale.
 */
const RadiusSteps: SizingStep[] = [
  { token: '--radius-xs', note: '3px' },
  { token: '--radius-sm', note: '4px' },
  { token: '--radius-md', note: '6px' },
  { token: '--radius-lg', note: '8px' },
  { token: '--radius-xl', note: '12px' },
  { token: '--radius-full', note: '999px' },
];

/**
 * The box size scale.
 */
const SizeSteps: SizingStep[] = [
  { token: '--size-xs', note: '80px' },
  { token: '--size-sm', note: '128px' },
  { token: '--size-md', note: '192px' },
  { token: '--size-lg', note: '256px' },
  { token: '--size-xl', note: '320px' },
  { token: '--size-2xl', note: '480px' },
];

/**
 * The border widths, all new.
 */
const BorderWidths: SizingStep[] = [
  { token: '--border-width-thin', note: '1px' },
  { token: '--border-width-medium', note: '2px' },
  { token: '--border-width-thick', note: '3px' },
];

/**
 * The icon size steps.
 */
const IconSizes: SizingStep[] = [
  { token: '--icon-size-2xs', note: '12px' },
  { token: '--icon-size-xs', note: '14px' },
  { token: '--icon-size-sm', note: '16px' },
  { token: '--icon-size-md', note: '18px' },
  { token: '--icon-size-lg', note: '24px' },
  { token: '--icon-size-xl', note: '40px' },
];
