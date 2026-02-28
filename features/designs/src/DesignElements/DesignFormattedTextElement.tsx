import { FormattedTextElement, createTextCssStyle } from '@minddrop/designs';

export interface DesignFormattedTextElementProps {
  /**
   * The formatted text element to render.
   */
  element: FormattedTextElement;
}

/**
 * Pure display renderer for a formatted text design element.
 * Renders a styled div representing the formatted text area.
 */
export const DesignFormattedTextElement: React.FC<
  DesignFormattedTextElementProps
> = ({ element }) => {
  return <div style={createTextCssStyle(element.style)} />;
};
