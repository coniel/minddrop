import { TextElement, createTextCssStyle } from '@minddrop/designs';

export interface DesignTextElementProps {
  /**
   * The text element to render.
   */
  element: TextElement;
}

/**
 * Pure display renderer for a text design element.
 * Shows the element's placeholder text with its style applied.
 */
export const DesignTextElement: React.FC<DesignTextElementProps> = ({
  element,
}) => {
  return (
    <span
      style={createTextCssStyle(element.style)}
      data-placeholder={element.placeholder}
    >
      {element.placeholder}
    </span>
  );
};
