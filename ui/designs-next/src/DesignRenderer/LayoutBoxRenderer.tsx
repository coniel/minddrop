import { Design, LayoutAxis, LayoutBox } from '@minddrop/designs-next';
import { resolveLayoutBoxKey, resolveLayoutBoxStyle } from '../utils';
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
   * sized. A band stretches across its rows box, a column box takes
   * its flex share of the width. Null for the root box, which fills
   * the render.
   */
  axis: LayoutAxis | null;
}

/**
 * Renders a box of a design's layout tree as flow, and its children
 * inside it.
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

  // Nest the children of a rows or column box in a flex box
  if (box.type === 'rows' || box.type === 'columns') {
    return (
      <div className={`design-renderer-${box.type}`} style={style}>
        {box.children.map((child) => (
          <LayoutBoxRenderer
            key={resolveLayoutBoxKey(child)}
            box={child}
            design={design}
            axis={box.type}
          />
        ))}
      </div>
    );
  }

  // Render a spacer as an empty box at its size
  if (box.type === 'spacer') {
    return <div className="design-renderer-spacer" style={style} />;
  }

  // Render an element box as its element
  if (box.type === 'element') {
    return (
      <LayoutElementRenderer
        element={box.element}
        designElements={design.elements}
        style={style}
      />
    );
  }

  // Render an atomic box with its elements positioned inside it
  return (
    <LayoutAtomRenderer
      box={box}
      designElements={design.elements}
      style={style}
    />
  );
};
