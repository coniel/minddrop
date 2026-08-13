import { useMemo } from 'react';
import { PagePanelElement } from '@minddrop/designs-legacy';
import { useDesignPreview } from '../../DesignElements';
import { useLayoutId } from '../../LayoutIdContext';
import { useLayoutRenderContext } from '../../LayoutRenderContext';
import { ContainerDesignElement } from '../container';
import { usePagePanelResize } from './usePagePanelResize';
import './page-panel-resize.css';

export interface PagePanelDesignElementProps {
  /**
   * The panel element to render.
   */
  element: PagePanelElement;
}

/**
 * Display renderer for a page panel. In actual use it wraps the
 * container renderer with a draggable edge handle for width
 * resizing, persisting the width per layout and window size. In
 * previews, or outside a layout context, it renders the panel
 * without resizing.
 */
export const PagePanelDesignElement: React.FC<PagePanelDesignElementProps> = ({
  element,
}) => {
  const layoutId = useLayoutId();
  const context = useLayoutRenderContext();
  const isPreview = useDesignPreview();

  // Previews and layout-less renders are non-interactive
  if (isPreview || !layoutId) {
    return <ContainerDesignElement element={element} />;
  }

  return (
    <ResizablePagePanel
      element={element}
      layoutId={layoutId}
      context={context ?? 'default'}
    />
  );
};

interface ResizablePagePanelProps {
  /**
   * The panel element to render.
   */
  element: PagePanelElement;

  /**
   * The ID of the layout the panel belongs to.
   */
  layoutId: string;

  /**
   * The context the layout is rendered in.
   */
  context: string;
}

/**
 * Renders a page panel with a draggable edge handle, overriding the
 * rendered width with the live resize width.
 */
const ResizablePagePanel: React.FC<ResizablePagePanelProps> = ({
  element,
  layoutId,
  context,
}) => {
  const { width, handleResizeMouseDown } = usePagePanelResize(
    layoutId,
    context,
    element.side,
    element.style.width,
  );

  // Override the rendered width with the live resize width
  const panelElement = useMemo(
    () => ({ ...element, style: { ...element.style, width } }),
    [element, width],
  );

  return (
    <div className="page-panel-region">
      <ContainerDesignElement element={panelElement} />
      <div
        className={`page-panel-resize-handle page-panel-resize-handle-${element.side}`}
        onMouseDown={handleResizeMouseDown}
      />
    </div>
  );
};
