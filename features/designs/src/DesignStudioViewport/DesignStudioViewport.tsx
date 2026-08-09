import { useCallback } from 'react';
import { Canvas, useCanvasTransformLayer } from '@minddrop/ui-canvas';
import { DesignStudioStore } from '../DesignStudioStore';
import { SelectionOverlay } from '../SelectionOverlay';
import './DesignStudioViewport.css';

/**
 * Renders the zoomable/pannable viewport that wraps the design
 * canvas area. Must be rendered within the design studio's
 * CanvasProvider.
 */
export const DesignStudioViewport: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const transformLayerRef = useCanvasTransformLayer();

  // Clicking the empty canvas deactivates the layout and clears
  // the selection
  const handleBackgroundMouseDown = useCallback(() => {
    DesignStudioStore.setActiveLayout(null);
  }, []);

  return (
    <Canvas
      className="design-studio-viewport"
      shortcutScope="window"
      onBackgroundMouseDown={handleBackgroundMouseDown}
    >
      {children}
      <SelectionOverlay transformLayerRef={transformLayerRef} />
    </Canvas>
  );
};
