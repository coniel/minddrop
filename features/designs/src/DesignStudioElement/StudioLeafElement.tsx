import { CSSProperties } from 'react';
import { DesignElement, resolveElementStyle } from '@minddrop/designs';
import { useLayoutType } from '../LayoutTypeContext';
import './StudioLeafElement.css';

export interface StudioLeafElementProps extends React.PropsWithChildren {
  /**
   * The leaf element being wrapped.
   */
  element: DesignElement;

  /**
   * Props to spread on the wrapper for drag-and-drop and
   * click-to-select behaviour.
   */
  rootProps: Record<string, unknown>;

  /**
   * Optional ref to the wrapper element (e.g. a picker anchor).
   */
  wrapperRef?: React.RefObject<HTMLDivElement | null>;
}

/**
 * Studio wrapper for leaf elements. Display components carry no
 * interaction props, so the wrapper provides the box that receives
 * the drag-and-drop and selection props. It mirrors the leaf's
 * sizing behaviour so the wrapped element lays out like the leaf
 * itself would.
 */
export const StudioLeafElement: React.FC<StudioLeafElementProps> = ({
  element,
  rootProps,
  wrapperRef,
  children,
}) => {
  // The surrounding layout's type, which role styles resolve against
  const layoutType = useLayoutType();

  // Separate style from rootProps so it merges with the sizing CSS
  const { style: rootStyle, ...rootPropsWithoutStyle } = rootProps as {
    style?: CSSProperties;
    [key: string]: unknown;
  };

  // Mirror the leaf's resolved sizing onto the wrapper so fills
  // and full widths behave as they would without it
  const style = resolveElementStyle(element, layoutType ?? undefined);
  const sizingCss: CSSProperties = {
    // A filling leaf grows by its share, from a zero basis so the
    // ratio governs the whole height rather than the leftovers
    ...('height' in style &&
      style.height === 'fill' && {
        flexGrow: ('fillRatio' in style ? style.fillRatio : undefined) ?? 1,
        flexBasis: 0,
        minHeight: 0,
      }),
  };

  return (
    <div
      ref={wrapperRef}
      className="designs-studio-leaf-element"
      {...rootPropsWithoutStyle}
      style={{ ...sizingCss, ...rootStyle }}
    >
      {children}
    </div>
  );
};
