import { CSSProperties } from 'react';

export interface DesignTextProps {
  /**
   * The text to render.
   */
  text?: string;

  /**
   * The resolved CSS of the design element rendering the text.
   */
  css: CSSProperties;
}

/**
 * Renders a text-like design element's content with its resolved
 * element CSS.
 */
export const DesignText: React.FC<DesignTextProps> = ({ text, css }) => {
  return (
    <span className="designs-text" style={css}>
      {text}
    </span>
  );
};
