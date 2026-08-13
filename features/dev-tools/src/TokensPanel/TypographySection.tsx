import React from 'react';
import { ValueRow } from './ValueRow';

/**
 * Renders the typography tokens: the font size scale, weights,
 * line heights and letter spacing.
 */
export const TypographySection: React.FC = () => (
  <div className="dev-tools-tokens-section">
    <h3 className="dev-tools-tokens-heading">Font sizes</h3>

    <div className="dev-tools-tokens-group">
      {FontSizes.map((step) => (
        <ValueRow
          key={step.token}
          token={step.token}
          note={step.note}
          sample={
            <span style={{ fontSize: `var(${step.token})` }}>{SampleText}</span>
          }
        />
      ))}
    </div>

    <h3 className="dev-tools-tokens-heading">Font weights</h3>

    <div className="dev-tools-tokens-group">
      {FontWeights.map((step) => (
        <ValueRow
          key={step.token}
          token={step.token}
          note={step.note}
          sample={
            <span style={{ fontWeight: `var(${step.token})` }}>
              {SampleText}
            </span>
          }
        />
      ))}
    </div>

    <h3 className="dev-tools-tokens-heading">Line heights</h3>

    <div className="dev-tools-tokens-group">
      {LineHeights.map((step) => (
        <ValueRow
          key={step.token}
          token={step.token}
          note={step.note}
          sample={
            <p
              className="dev-tools-tokens-line-sample"
              style={{ lineHeight: `var(${step.token})` }}
            >
              {SampleParagraph}
            </p>
          }
        />
      ))}
    </div>

    <h3 className="dev-tools-tokens-heading">Letter spacing</h3>

    <div className="dev-tools-tokens-group">
      {LetterSpacings.map((step) => (
        <ValueRow
          key={step.token}
          token={step.token}
          note={step.note}
          sample={
            <span
              className="dev-tools-tokens-letter-spacing-sample"
              style={{ letterSpacing: `var(${step.token})` }}
            >
              Overline label
            </span>
          }
        />
      ))}
    </div>
  </div>
);

/**
 * Text rendered in single line type samples.
 */
const SampleText = 'The quick brown fox';

/**
 * Longer text for line height samples, where wrapping is needed
 * to make the leading visible.
 */
const SampleParagraph =
  'The quick brown fox jumps over the lazy dog. Pack my box with five ' +
  'dozen liquor jugs. How vexingly quick daft zebras jump.';

interface TypographyStep {
  /**
   * Name of the token.
   */
  token: string;

  /**
   * The token's resolved value.
   */
  note: string;
}

/**
 * The font size scale.
 */
const FontSizes: TypographyStep[] = [
  { token: '--font-size-2xs', note: '11px' },
  { token: '--font-size-xs', note: '12px' },
  { token: '--font-size-sm', note: '13px' },
  { token: '--font-size-base', note: '14px' },
  { token: '--font-size-md', note: '16px' },
  { token: '--font-size-lg', note: '18px' },
  { token: '--font-size-xl', note: '20px' },
  { token: '--font-size-2xl', note: '24px' },
  { token: '--font-size-3xl', note: '28px' },
  { token: '--font-size-4xl', note: '32px' },
  { token: '--font-size-5xl', note: '40px' },
];

/**
 * The font weights.
 */
const FontWeights: TypographyStep[] = [
  { token: '--font-weight-regular', note: '400' },
  { token: '--font-weight-medium', note: '500' },
  { token: '--font-weight-semibold', note: '600' },
  { token: '--font-weight-bold', note: '700' },
];

/**
 * The line heights.
 */
const LineHeights: TypographyStep[] = [
  { token: '--line-height-none', note: '1' },
  { token: '--line-height-tight', note: '1.2' },
  { token: '--line-height-snug', note: '1.4' },
  { token: '--line-height-normal', note: '1.5' },
  { token: '--line-height-relaxed', note: '1.65' },
  { token: '--line-height-loose', note: '1.75' },
];

/**
 * The letter spacing steps.
 */
const LetterSpacings: TypographyStep[] = [
  { token: '--letter-spacing-tight', note: '-0.02em' },
  { token: '--letter-spacing-normal', note: '0em' },
  { token: '--letter-spacing-wide', note: '0.05em' },
  { token: '--letter-spacing-wider', note: '0.08em' },
];
