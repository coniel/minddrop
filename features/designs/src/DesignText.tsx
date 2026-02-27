import { createTextCssStyle, TextElementStyle } from '@minddrop/designs';

export interface DesignTextProps {
  /**
   * The text to render.
   */
  text?: string;

  /**
   * The style of the design element rendering the text.
   */
  style: TextElementStyle;
}

export const DesignText: React.FC<DesignTextProps> = ({ text, style }) => {
  return (
    <span className="design-text" style={createTextCssStyle(style)}>
      {text}
    </span>
  );
};
