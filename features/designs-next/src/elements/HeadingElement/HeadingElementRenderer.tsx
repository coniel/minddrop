import { DesignElementProps } from '@minddrop/ui-designs-next';
import { HeadingElement } from './HeadingElement.types';
import { HeadingLineHeightUnits } from './HeadingElementConfig';
import './HeadingElementRenderer.css';

/**
 * Renders the heading element as prominent text clamped to the
 * number of lines its block height holds. Natural-height headings
 * grow with their content instead of clamping.
 */
export const HeadingElementRenderer: React.FC<
  DesignElementProps<HeadingElement>
> = ({ element }) => {
  // The number of lines the block height holds
  const lines = Math.max(
    1,
    Math.round(element.rowSpan / HeadingLineHeightUnits),
  );

  return (
    <div
      className="design-heading-element"
      style={element.naturalHeight ? undefined : { WebkitLineClamp: lines }}
    >
      {element.text}
    </div>
  );
};
