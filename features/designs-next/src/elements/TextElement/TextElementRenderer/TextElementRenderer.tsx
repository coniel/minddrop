import { DesignElementProps, Designs } from '@minddrop/designs-next';
import {
  resolveElementColor,
  resolveTextSettingsClass,
  useElementValue,
} from '@minddrop/ui-designs-next';
import { joinClasses } from '@minddrop/ui-primitives';
import { TextElement } from '../TextElement.types';
import './TextElementRenderer.css';

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

  // The text settings modifier classes
  const className = joinClasses(
    'design-text-element',
    resolveTextSettingsClass(element),
  );

  // The size, line height, weight and colour the text is set in
  const style: React.CSSProperties = {
    fontSize: element.fontSize ?? Designs.constants.DefaultFontSize,
    lineHeight: element.lineHeight ?? Designs.constants.DefaultLineHeight,
    fontWeight: element.fontWeight,
    color: resolveElementColor(element.textColor),
  };

  return (
    <div className={className} style={style}>
      {propertyValue ?? element.content}
    </div>
  );
};
