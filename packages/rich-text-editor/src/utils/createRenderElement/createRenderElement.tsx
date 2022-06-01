import { RTElementConfig, RTElementProps } from '@minddrop/rich-text';
import React from 'react';

/**
 * Creates a `renderElement` function used by Slate's `Editable` component
 * to render rich text elements. Renders elements using the component from
 * the element type's configuration object. If the element type configuration
 * is not in the provided configurations, renders a simple DIV containing the
 * element's children.
 *
 * @param configs Rich text element configuration objects.
 * @returns A renderElement function.
 */
export function createRenderElement(
  configs: RTElementConfig[],
): (props: RTElementProps) => React.ReactElement {
  return (props: RTElementProps) => {
    // Get the config for the element type
    const config = configs.find(({ type }) => type === props.element.type);

    // Add the element ID to the attributes prop
    const attributes = { ...props.attributes, id: props.element.id };

    if (config) {
      // Render the config's component
      return <config.component {...props} attributes={attributes} />;
    }

    // Render a plain div if no matching element config was found
    // (should not occure but added to prevent errors just in case).
    return <div {...attributes}>{props.children}</div>;
  };
}
