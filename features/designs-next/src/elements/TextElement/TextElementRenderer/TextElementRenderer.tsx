import { DesignElementProps } from '@minddrop/designs-next';
import {
  resolveElementColor,
  resolveTextSettingsClass,
  useElementValue,
} from '@minddrop/ui-designs-next';
import { joinClasses } from '@minddrop/ui-primitives';
import { TextElement } from '../TextElement.types';
import { TextLineHeightUnits } from '../TextElementConfig';
import './TextElementRenderer.css';

/**
 * Renders the text element as wrapping body text, taking it from
 * the property the element maps to and falling back to its own
 * content. Fixed-height text clamps to the number of lines its block
 * height holds, natural height text grows with its content.
 */
export const TextElementRenderer: React.FC<DesignElementProps<TextElement>> = ({
  element,
}) => {
  const propertyValue = useElementValue(element);

  // The number of lines the block height holds
  const lines = Math.max(1, Math.round(element.rowSpan / TextLineHeightUnits));

  // The text settings modifier classes
  const className = joinClasses(
    'design-text-element',
    resolveTextSettingsClass(element),
  );

  // The weight and colour the text is set in, with the line clamp
  // of a fixed height block.
  const style: React.CSSProperties = {
    fontWeight: element.fontWeight,
    color: resolveElementColor(element.textColor),
    ...(element.naturalHeight ? undefined : { WebkitLineClamp: lines }),
  };

  return (
    <div className={className} style={style}>
      {propertyValue ?? element.content}
    </div>
  );
};
