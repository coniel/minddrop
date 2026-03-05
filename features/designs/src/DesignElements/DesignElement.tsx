import { DesignElement as DesignElementType } from '@minddrop/designs';
import { elementUIMap } from '../design-elements';
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

  // Look up the UI config for this element type
  const ui = elementUIMap[element.type];

  if (!ui) {
    return null;
  }

  const Component = ui.DisplayComponent;
  let rendered: React.ReactNode = <Component element={element} />;

  // Apply the wrapper if provided and the element type is not excluded
  if (wrapperConfig && !wrapperConfig.excludeTypes.includes(element.type)) {
    rendered = wrapperConfig.wrapper(element, rendered);
  }

  // Wrap in a data-element-id div for DOM querying (e.g. connection lines).
  // Uses display:contents so it doesn't affect layout.
  return (
    <div data-element-id={element.id} style={{ display: 'contents' }}>
      {rendered}
    </div>
  );
};
