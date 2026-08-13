import React from 'react';

export interface SwatchProps {
  /**
   * Color token filling the swatch.
   */
  token: string;
}

/**
 * Renders a color swatch filled with a color token.
 */
export const Swatch: React.FC<SwatchProps> = ({ token }) => (
  <div
    className="dev-tools-tokens-swatch"
    style={{ backgroundColor: `var(${token})` }}
  />
);
