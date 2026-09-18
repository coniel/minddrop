import { DesignElement, Designs, LayoutBox } from '@minddrop/designs-next';
import { resolveContentFitStyles } from '../utils';
import { LayoutAtomRenderer } from './LayoutAtomRenderer';
import { LayoutElementRenderer } from './LayoutElementRenderer';

export interface LayoutBoxRendererProps {
  /**
   * The box to render.
   */
  box: LayoutBox;

  /**
   * The design's elements, which element children are resolved
   * from.
   */
  elements: DesignElement[];
}

/**
 * Renders a box of a design's layout tree as flow: bands stack in a
 * flex column, spacers keep their unit height, elements take the
 * height their content fit gives them, and atomic boxes position
 * their elements absolutely.
 */
export const LayoutBoxRenderer: React.FC<LayoutBoxRendererProps> = ({
  box,
  elements,
}) => {
  if (box.type === 'rows') {
    return (
      <div className="design-renderer-rows">
        {box.children.map((child) => (
          <LayoutBoxRenderer
            key={resolveBoxKey(child)}
            box={child}
            elements={elements}
          />
        ))}
      </div>
    );
  }

  if (box.type === 'spacer') {
    return (
      <div
        className="design-renderer-spacer"
        style={{ height: box.rowSpan * Designs.constants.UnitPixelSize }}
      />
    );
  }

  if (box.type === 'element') {
    return (
      <LayoutElementRenderer
        element={box.element}
        elements={elements}
        style={resolveContentFitStyles(box.element)}
      />
    );
  }

  return <LayoutAtomRenderer box={box} elements={elements} />;
};

/**
 * Resolves the key a box renders under among its siblings: the
 * element's ID for an element box, the box's position otherwise.
 *
 * @param box - The box.
 * @returns The box's key.
 */
function resolveBoxKey(box: LayoutBox): string {
  if (box.type === 'element') {
    return box.element.id;
  }

  return `${box.type}-${box.row}-${box.column}`;
}
