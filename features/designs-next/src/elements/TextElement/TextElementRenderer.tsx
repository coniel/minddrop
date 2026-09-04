import { DesignElementProps } from '@minddrop/designs-next';
import { resolveTextSettingsClass } from '@minddrop/ui-designs-next';
import { joinClasses } from '@minddrop/ui-primitives';
import { TextElement } from './TextElement.types';
import { TextLineHeightUnits } from './TextElementConfig';
import './TextElementRenderer.css';

/**
 * Renders the text element as wrapping body text. Fixed-height text
 * clamps to the number of lines its block height holds, natural
 * height text grows with its content.
 */
export const TextElementRenderer: React.FC<DesignElementProps<TextElement>> = ({
  element,
}) => {
  // The number of lines the block height holds
  const lines = Math.max(1, Math.round(element.rowSpan / TextLineHeightUnits));

  // The text settings modifier classes
  const className = joinClasses(
    'design-text-element',
    resolveTextSettingsClass(element),
  );

  return (
    <div
      className={className}
      style={element.naturalHeight ? undefined : { WebkitLineClamp: lines }}
    >
      {element.text}
    </div>
  );
};
