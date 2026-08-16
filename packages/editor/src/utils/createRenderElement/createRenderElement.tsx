import React, { useContext } from 'react';
import { RenderElementProps } from 'slate-react';
import { BlockFrames } from '../../BlockFrames';
import { BlockSelectionContext } from '../../BlockSelectionContext';
import { BlockElementProps, EditorBlockElementConfig } from '../../types';
import { hasBlockId } from '../block-id';
import { isInlineElement } from '../element-level';

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
  configs: EditorBlockElementConfig[],
): (props: RenderElementProps) => React.ReactElement {
  // eslint-disable-next-line react/display-name
  return (props: RenderElementProps) => {
    // Get the config for the element type
    const config = configs.find(({ type }) => type === props.element.type);

    if (config) {
      return (
        <RenderedElement
          {...(props as BlockElementProps)}
          component={config.component}
        />
      );
    }

    // Render a plain div if no matching element config was found
    // (should not occure but added to prevent errors just in case).
    return <RenderedElement {...(props as BlockElementProps)} />;
  };
}

interface RenderedElementProps extends BlockElementProps {
  /**
   * The component rendering the element. Elements of a type with
   * no config render as a plain div.
   */
  component?: EditorBlockElementConfig['component'];
}

/**
 * Renders an element using its type's component, marking it as
 * selected while it is one of the editor's selected blocks.
 */
const RenderedElement: React.FC<RenderedElementProps> = ({
  component: Component,
  ...props
}) => {
  const selectedBlockIds = useContext(BlockSelectionContext);

  // Only top level blocks carry a block ID, so inline elements
  // are never marked
  const selected =
    hasBlockId(props.element) && selectedBlockIds.has(props.element.id);

  const attributes = {
    ...props.attributes,
    'data-block-selected': selected || undefined,
  };

  const rendered = Component ? (
    <Component {...props} attributes={attributes} />
  ) : (
    <div {...attributes}>{props.children}</div>
  );

  // Inline elements sit within a block's content, so they are drawn by the
  // block's own containers rather than by any of their own
  if (isInlineElement(props.element.type)) {
    return rendered;
  }

  // The block is drawn inside the containers it sits in, which render
  // its indentation and their own markers around it
  return <BlockFrames element={props.element}>{rendered}</BlockFrames>;
};
