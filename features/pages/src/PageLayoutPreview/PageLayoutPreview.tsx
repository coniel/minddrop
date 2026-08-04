import { useEffect, useRef, useState } from 'react';
import { Design, Layout } from '@minddrop/designs';
import {
  DesignPreviewProvider,
  LayoutRenderer,
} from '@minddrop/feature-designs';
import './PageLayoutPreview.css';

// Fraction of the preview area filled by the layout, leaving a margin
const PreviewFill = 0.9;

export interface PageLayoutPreviewProps {
  /**
   * The design containing the layout.
   */
  design: Design;

  /**
   * The page layout to preview.
   */
  layout: Layout;
}

/**
 * Renders a scaled-down live preview of a page layout using the
 * design's property placeholders in place of real values.
 */
export const PageLayoutPreview: React.FC<PageLayoutPreviewProps> = ({
  design,
  layout,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Content-sized layouts fall back to a square frame
  const frameHeight = layout.frame.height || layout.frame.width;

  // Scale that fits the layout into the preview area
  const scale = getPreviewScale(layout.frame.width, frameHeight, containerSize);

  // Track the preview area size so the layout can be fitted to it
  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;

      setContainerSize({ width, height });
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="page-layout-preview">
      {scale > 0 && (
        <div
          className="page-layout-preview-canvas"
          style={{
            width: layout.frame.width,
            height: frameHeight,
            transform: `translate(-50%, -50%) scale(${scale})`,
          }}
        >
          <DesignPreviewProvider value>
            <LayoutRenderer
              layout={layout}
              designProperties={design.properties}
            />
          </DesignPreviewProvider>
        </div>
      )}
    </div>
  );
};

/**
 * Computes the scale that fits the layout frame within the preview
 * area, leaving a margin defined by PreviewFill. Returns 0 until the
 * preview area has a size.
 */
function getPreviewScale(
  frameWidth: number,
  frameHeight: number,
  containerSize: { width: number; height: number },
): number {
  // The preview area has not been measured yet
  if (!containerSize.width || !containerSize.height) {
    return 0;
  }

  // Fit the frame into the preview area on both axes
  return Math.min(
    (containerSize.width * PreviewFill) / frameWidth,
    (containerSize.height * PreviewFill) / frameHeight,
    1,
  );
}
