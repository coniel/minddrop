import { DesignElement, Designs, LayoutAtomBox } from '@minddrop/designs-next';
import { resolveAtomElementStyle } from '../utils';
import { LayoutElementRenderer } from './LayoutElementRenderer';

export interface LayoutAtomRendererProps {
  /**
   * The atomic box to render.
   */
  box: LayoutAtomBox;

  /**
   * The design's elements, which element children are resolved
   * from.
   */
  elements: DesignElement[];
}

/**
 * Renders an atomic box at its unit height, its elements positioned
 * absolutely inside it at their unit rects.
 */
export const LayoutAtomRenderer: React.FC<LayoutAtomRendererProps> = ({
  box,
  elements,
}) => (
  <div
    className="design-renderer-atom"
    style={{ minHeight: box.rowSpan * Designs.constants.UnitPixelSize }}
  >
    {/* Array order doubles as paint order, later elements layer on top */}
    {box.elements.map((element) => (
      <LayoutElementRenderer
        key={element.id}
        element={element}
        elements={elements}
        style={resolveAtomElementStyle(element, box)}
      />
    ))}
  </div>
);
