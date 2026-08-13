import React from 'react';

/**
 * Renders a sample card inside every scheme scope to verify that
 * the schemable roles re-anchor to the scheme's accent while the
 * fixed roles stay put.
 */
export const SchemesSection: React.FC = () => (
  <div className="dev-tools-tokens-section">
    <p className="dev-tools-tokens-hint">
      Schemable roles must tint with each hue. The primary and danger chips are
      fixed roles and must look identical on every card.
    </p>

    <div className="dev-tools-tokens-scheme-grid">
      {SchemeHues.map((hue) => (
        <SchemeCard key={hue} hue={hue} />
      ))}
    </div>
  </div>
);

interface SchemeCardProps {
  /**
   * The scheme hue the card renders inside.
   */
  hue: string;
}

/**
 * Renders the schemable role samples inside a single scheme scope.
 */
const SchemeCard: React.FC<SchemeCardProps> = ({ hue }) => (
  <div className={`scheme-${hue} dev-tools-tokens-scheme-card`}>
    {/* Schemable text roles */}
    <div className="dev-tools-tokens-scheme-name">{hue}</div>
    <div className="dev-tools-tokens-scheme-text-muted">Muted text</div>
    <div className="dev-tools-tokens-scheme-text-subtle">Subtle text</div>

    {/* Interactive fills resolving through the accent channel */}
    <div className="dev-tools-tokens-scheme-chips">
      <div className="dev-tools-tokens-chip dev-tools-tokens-chip-accent">
        fill
      </div>
      <div className="dev-tools-tokens-chip dev-tools-tokens-chip-accent-hover">
        hover
      </div>
      <div className="dev-tools-tokens-chip dev-tools-tokens-chip-accent-active">
        active
      </div>
      <div className="dev-tools-tokens-chip dev-tools-tokens-chip-solid">
        solid
      </div>
    </div>

    {/* Fixed roles which must not tint with the scheme */}
    <div className="dev-tools-tokens-scheme-chips">
      <div className="dev-tools-tokens-chip dev-tools-tokens-chip-primary">
        primary
      </div>
      <div className="dev-tools-tokens-chip dev-tools-tokens-chip-danger">
        danger
      </div>
    </div>
  </div>
);

/**
 * Every scheme class defined in the theme.
 */
const SchemeHues = [
  'neutral',
  'gray',
  'blue',
  'cyan',
  'green',
  'yellow',
  'orange',
  'red',
  'pink',
  'purple',
  'brown',
];
