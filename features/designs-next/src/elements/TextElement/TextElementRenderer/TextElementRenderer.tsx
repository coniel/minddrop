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
 * content. Text which may not grow past its block clamps to the
 * number of lines the block holds, text which may grows with its
 * content.
 */
export const TextElementRenderer: React.FC<DesignElementProps<TextElement>> = ({
  element,
}) => {
  const propertyValue = useElementValue(element);

  // The number of lines the block height holds
  const lines = Math.max(1, Math.round(element.rowSpan / TextLineHeightUnits));

  // Whether the text may grow past its block
  const contentFit = element.contentFit ?? 'fixed';
  const grows = contentFit === 'grow' || contentFit === 'natural';

  // The text settings modifier classes
  const className = joinClasses(
    'design-text-element',
    resolveTextSettingsClass(element),
  );

  // The weight and colour the text is set in, with the line clamp
  // of a block it may not grow past.
  const style: React.CSSProperties = {
    fontWeight: element.fontWeight,
    color: resolveElementColor(element.textColor),
    ...(grows ? undefined : { WebkitLineClamp: lines }),
  };

  return (
    <div className={className} style={style}>
      {propertyValue ?? element.content}
    </div>
  );
};
