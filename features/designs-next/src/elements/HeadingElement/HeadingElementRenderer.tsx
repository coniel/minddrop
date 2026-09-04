import { DesignElementProps } from '@minddrop/designs-next';
import { resolveTextSettingsClass } from '@minddrop/ui-designs-next';
import { joinClasses } from '@minddrop/ui-primitives';
import { HeadingElement } from './HeadingElement.types';
import {
  DefaultHeadingLevel,
  HeadingLineHeightUnits,
} from './HeadingElementConfig';
import './HeadingElementRenderer.css';

/**
 * Renders the heading element as prominent text clamped to the
 * number of lines its block height holds. Natural-height headings
 * grow with their content instead of clamping.
 */
export const HeadingElementRenderer: React.FC<
  DesignElementProps<HeadingElement>
> = ({ element }) => {
  // The element's heading level
  const level = element.level ?? DefaultHeadingLevel;

  // The number of lines the block height holds
  const lines = Math.max(
    1,
    Math.round(element.rowSpan / HeadingLineHeightUnits[level]),
  );

  // The level and text settings modifier classes
  const className = joinClasses(
    'design-heading-element',
    `design-heading-element-level-${level}`,
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
