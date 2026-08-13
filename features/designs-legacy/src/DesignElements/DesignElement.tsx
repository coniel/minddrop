import { DesignElement as DesignElementType } from '@minddrop/designs-legacy';
import { TransientViewStateScope } from '@minddrop/ui-primitives';
import { elementUIMap } from '../design-elements';
import { useElementHidden } from '../useElementHidden';
import { useDesignElementWrapper } from './DesignElementWrapperContext';

export interface DesignElementProps {
  /**
   * The design element to render.
   */
  element: DesignElementType;
}

/**
 * Dispatcher component that routes a design element to the
 * correct type-specific renderer based on `element.type`.
 * If a DesignElementWrapperProvider is present, wraps the
 * rendered element with the provided wrapper function.
 */
export const DesignElement: React.FC<DesignElementProps> = ({ element }) => {
  const wrapperConfig = useDesignElementWrapper();
  const hidden = useElementHidden(element);

  // Look up the UI config for this element type
  const ui = elementUIMap[element.type];

  if (!ui) {
    return null;
  }

  // Hide property-bound elements with no value per their empty behavior
  if (hidden) {
    return null;
  }

  const Component = ui.DisplayComponent;
  let rendered: React.ReactNode = <Component element={element} />;

  // Apply the wrapper if provided and the element type is not excluded
  if (wrapperConfig && !wrapperConfig.excludeTypes.includes(element.type)) {
    rendered = wrapperConfig.wrapper(element, rendered);
  }

  // Wrap in a data-element-id div for DOM querying (e.g. connection lines).
  // Uses display:contents so it doesn't affect layout. The transient
  // state scope keys stateful content by its ancestor element chain so
  // identical components in sibling elements cannot collide.
  return (
    <TransientViewStateScope segment={element.id}>
      <div data-element-id={element.id} style={{ display: 'contents' }}>
        {rendered}
      </div>
    </TransientViewStateScope>
  );
};
