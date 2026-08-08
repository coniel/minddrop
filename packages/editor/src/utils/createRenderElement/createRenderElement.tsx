import { RenderElementProps } from 'slate-react';
import {
  BlockElementProps,
  Editor,
  EditorBlockElementConfig,
  EditorInlineElementConfig,
} from '../../types';
import { isBlockSelected } from '../isBlockSelected';

/**
 * Creates a `renderElement` function used by Slate's `Editable` component
 * to render elements. Renders elements using the component from the element
 * type's configuration object. If the element type configuration is not in
 * the provided configurations, renders a simple DIV containing the
 * element's children.
 *
 * @param configs - An array of element type configurations.
 * @param editor - An editor instance.
 * @returns A renderElement function.
 */
export function createRenderElement(
  configs: (EditorInlineElementConfig | EditorBlockElementConfig)[],
  editor: Editor,
): (props: RenderElementProps) => React.ReactElement {
  // eslint-disable-next-line react/display-name
  return (props: RenderElementProps) => {
    // Get the config for the element type
    const config = configs.find(({ type }) => type === props.element.type);

    // Marks the element as selected when it is a block covered by
    // a block selection. Slate re-renders an element whenever its
    // own part of the selection changes, so this is up to date
    // without watching the selection.
    const attributes = {
      ...props.attributes,
      'data-block-selected':
        isBlockSelected(editor, props.element) || undefined,
    };

    if (config) {
      // Typecast as block element to prevent TS complaining
      // about block/inline element component/props mismatch.
      const Component = (config as EditorBlockElementConfig).component;

      // Render the config's component
      return (
        <Component {...(props as BlockElementProps)} attributes={attributes} />
      );
    }

    // Render a plain div if no matching element config was found
    // (should not occure but added to prevent errors just in case).
    return <div {...attributes}>{props.children}</div>;
  };
}
