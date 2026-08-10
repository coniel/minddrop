import { useCallback } from 'react';
import { Canvas, useCanvasTransformLayer } from '@minddrop/ui-canvas';
import { DesignStudioStore } from '../DesignStudioStore';
import { SelectionOverlay } from '../SelectionOverlay';
import './DesignStudioViewport.css';

export interface DesignStudioViewportProps extends React.PropsWithChildren {
  /**
   * The design's name, shown in the viewport's name field.
   */
  name: string;

  /**
   * Called with the new name when a name edit is committed.
   */
  onNameChange: (name: string) => void;
}

/**
 * Renders the zoomable/pannable viewport that wraps the design
 * canvas area. Must be rendered within the design studio's
 * CanvasProvider.
 */
export const DesignStudioViewport: React.FC<DesignStudioViewportProps> = ({
  children,
  name,
  onNameChange,
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
      name={name}
      onNameChange={onNameChange}
      onBackgroundMouseDown={handleBackgroundMouseDown}
    >
      {children}
      <SelectionOverlay transformLayerRef={transformLayerRef} />
    </Canvas>
  );
};
