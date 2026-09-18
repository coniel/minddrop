import { Design, LayoutAxis, LayoutBox } from '@minddrop/designs-next';
import { resolveLayoutBoxStyle } from '../utils';
import { LayoutAtomRenderer } from './LayoutAtomRenderer';
import { LayoutElementRenderer } from './LayoutElementRenderer';

export interface LayoutBoxRendererProps {
  /**
   * The box to render.
   */
  box: LayoutBox;

  /**
   * The design the box belongs to, which element children and the
   * design's aspect ratio are read from.
   */
  design: Design;

  /**
   * The axis of the box holding this one, which decides how it is
   * sized: a band stretches across its rows box, a column box takes
   * its flex share of the width. Null for the root box, which fills
   * the render.
   */
  axis: LayoutAxis | null;
}

/**
 * Renders a box of a design's layout tree as flow: bands stack in a
 * flex column, column boxes sit in a flex row, spacers keep their
 * unit size, elements take the height their content fit gives them,
 * and atomic boxes position their elements absolutely.
 */
export const LayoutBoxRenderer: React.FC<LayoutBoxRendererProps> = ({
  box,
  design,
  axis,
}) => {
  // Resolve the box's size inside the box holding it
  const style = resolveLayoutBoxStyle(
    box,
    axis,
    design.aspectRatio !== undefined,
  );

  if (box.type === 'rows' || box.type === 'columns') {
    return (
      <div className={`design-renderer-${box.type}`} style={style}>
        {box.children.map((child) => (
          <LayoutBoxRenderer
            key={resolveBoxKey(child)}
            box={child}
            design={design}
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
        elements={design.elements}
        style={style}
      />
    );
  }

  return (
    <LayoutAtomRenderer box={box} elements={design.elements} style={style} />
  );
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
