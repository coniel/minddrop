import { RenderElementProps } from 'slate-react';
import {
  EditorBlockElementConfig,
  EditorInlineElementConfig,
  BlockElementProps,
} from '../../types';

/**
 * Creates a `renderElement` function used by Slate's `Editable` component
 * to render elements. Renders elements using the component from the element
 * type's configuration object. If the element type configuration is not in
 * the provided configurations, renders a simple DIV containing the
 * element's children.
 *
 * @param configs - An array of element type configurations.
 * @returns A renderElement function.
 */
export function createRenderElement(
  configs: (EditorInlineElementConfig | EditorBlockElementConfig)[],
): (props: RenderElementProps) => React.ReactElement {
  // eslint-disable-next-line react/display-name
  return (props: RenderElementProps) => {
    // Get the config for the element type
    const config = configs.find(({ type }) => type === props.element.type);

    if (config) {
      // Typecast as block element to prevent TS complaining
      // about block/inline element component/props mismatch.
      const Component = (config as EditorBlockElementConfig).component;

      // Render the config's component
      return <Component {...(props as BlockElementProps)} />;
    }

    // Render a plain div if no matching element config was found
    // (should not occure but added to prevent errors just in case).
    return <div {...props.attributes}>{props.children}</div>;
  };
}
