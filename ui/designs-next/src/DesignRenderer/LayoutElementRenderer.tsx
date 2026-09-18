import {
  DesignElement,
  DesignElementConfigs,
  Designs,
} from '@minddrop/designs-next';

export interface LayoutElementRendererProps {
  /**
   * The element to render.
   */
  element: DesignElement;

  /**
   * The design's elements, which the element's children are
   * resolved from.
   */
  elements: DesignElement[];

  /**
   * The styles sizing and positioning the element's wrapper.
   */
  style?: React.CSSProperties;
}

/**
 * Renders an element through its registered component inside a
 * wrapper the layout sizes, or nothing for an unregistered type.
 */
export const LayoutElementRenderer: React.FC<LayoutElementRendererProps> = ({
  element,
  elements,
  style,
}) => {
  // Look up the element's renderer, skipping unregistered types
  const ElementComponent = DesignElementConfigs.get(
    element.type,
    false,
  )?.component;

  if (!ElementComponent) {
    return null;
  }

  return (
    <div
      data-element-id={element.id}
      className="design-renderer-element"
      style={style}
    >
      <ElementComponent
        element={element}
        childElements={Designs.resolveChildElements(elements, element.id)}
      />
    </div>
  );
};
