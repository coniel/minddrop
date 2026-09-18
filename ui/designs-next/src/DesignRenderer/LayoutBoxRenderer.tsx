import { DesignElement, LayoutAxis, LayoutBox } from '@minddrop/designs-next';
import { resolveLayoutBoxStyle } from '../utils';
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

  /**
   * The axis of the box holding this one, which decides how it is
   * sized: a band stretches across its rows box, a column box takes
   * its flex share of the width.
   */
  axis: LayoutAxis;
}

/**
 * Renders a box of a design's layout tree as flow: bands stack in a
 * flex column, column boxes sit in a flex row, spacers keep their
 * unit size, elements take the height their content fit gives them,
 * and atomic boxes position their elements absolutely.
 */
export const LayoutBoxRenderer: React.FC<LayoutBoxRendererProps> = ({
  box,
  elements,
  axis,
}) => {
  // Resolve the box's size inside the box holding it
  const style = resolveLayoutBoxStyle(box, axis);

  if (box.type === 'rows' || box.type === 'columns') {
    return (
      <div className={`design-renderer-${box.type}`} style={style}>
        {box.children.map((child) => (
          <LayoutBoxRenderer
            key={resolveBoxKey(child)}
            box={child}
            elements={elements}
            axis={box.type}
          />
        ))}
      </div>
    );
  }

  if (box.type === 'spacer') {
    return <div className="design-renderer-spacer" style={style} />;
  }

  if (box.type === 'element') {
    return (
      <LayoutElementRenderer
        element={box.element}
        elements={elements}
        style={style}
      />
    );
  }

  return <LayoutAtomRenderer box={box} elements={elements} style={style} />;
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
