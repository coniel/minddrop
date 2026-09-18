import { DesignElement, LayoutAtomBox } from '@minddrop/designs-next';
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

  /**
   * The styles sizing the box inside the box holding it.
   */
  style?: React.CSSProperties;
}

/**
 * Renders an atomic box with its elements positioned absolutely
 * inside it at their unit rects.
 */
export const LayoutAtomRenderer: React.FC<LayoutAtomRendererProps> = ({
  box,
  elements,
  style,
}) => (
  <div className="design-renderer-atom" style={style}>
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
