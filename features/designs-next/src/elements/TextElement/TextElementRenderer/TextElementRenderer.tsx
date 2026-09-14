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
 * height. Shared by every element type which is text in different
 * defaults, the heading among them.
 */
export const TextElementRenderer: React.FC<DesignElementProps<TextElement>> = ({
  element,
}) => {
  const propertyValue = useElementValue(element);

  // Resolve the text settings into the styles they render as
  const style = resolveElementStyle(element, TextDefaults);

  return (
    <div className="design-text-element" style={style}>
      {propertyValue ?? element.content}
    </div>
  );
};
