import React from 'react';

export interface ValueRowProps {
  /**
   * Name of the token.
   */
  token: string;

  /**
   * The token's resolved value or usage guidance.
   */
  note?: string;

  /**
   * Sample rendered with the token.
   */
  sample: React.ReactNode;
}

/**
 * Renders a token row: the token name and note alongside a
 * sample styled with the token.
 */
export const ValueRow: React.FC<ValueRowProps> = ({ token, note, sample }) => (
  <div className="dev-tools-tokens-value-row">
    <div className="dev-tools-tokens-row-labels">
      {/* Token name and note */}
      <code className="dev-tools-tokens-token-name">{token}</code>
      {note && <span className="dev-tools-tokens-note">{note}</span>}
    </div>

    {/* The token sample */}
    <div className="dev-tools-tokens-row-sample">{sample}</div>
  </div>
);
