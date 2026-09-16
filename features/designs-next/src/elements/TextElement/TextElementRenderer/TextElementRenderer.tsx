import {
  DesignElementProps,
  DesignElementSettings,
  Designs,
} from '@minddrop/designs-next';
import {
  resolveElementStyle,
  useElementValue,
} from '@minddrop/ui-designs-next';
import { TextElement } from '../TextElement.types';
import './TextElementRenderer.css';

export interface TextElementRendererProps
  extends DesignElementProps<TextElement> {
  /**
   * The text to render. Takes precedence over the mapped property's
   * value and the element's own content.
   */
  text?: string;

  /**
   * Whether the text is held to one line. Text overrunning the
   * block's width ends in an ellipsis.
   */
  truncate?: boolean;
}

// The type body text is set in without settings of its own
const TextDefaults: DesignElementSettings = {
  fontFamily: 'sans',
  fontSize: Designs.constants.DefaultFontSize,
  lineHeight: Designs.constants.DefaultLineHeight,
};

/**
 * Renders a text element as wrapping text at its own size, weight
 * and alignment, taking it from the property the element maps to
 * and falling back to its own content. Text past the block's height
 * is clipped wherever its content fit holds the block to that
 * height.
 */
export const TextElementRenderer: React.FC<TextElementRendererProps> = ({
  element,
  text,
  truncate = false,
}) => {
  // Read the value of the property the element maps to
  const propertyValue = useElementValue(element);
  // Resolve the text settings into the styles they render as
  const style = resolveElementStyle(element, TextDefaults);
  // Resolve the text the element renders
  const content = text ?? propertyValue ?? element.content;

  // Render one-line text in a line box of its own. An ellipsis
  // needs a block container. The flex column is not one.
  if (truncate) {
    return (
      <div className="design-text-element" style={style}>
        <div className="design-text-element-line">{content}</div>
      </div>
    );
  }

  return (
    <div className="design-text-element" style={style}>
      {content}
    </div>
  );
};
