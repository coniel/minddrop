import { useCallback } from 'react';
import { dragContainsType } from '@minddrop/selection';
import {
  Canvas,
  CanvasPoint,
  useCanvasTransformLayer,
} from '@minddrop/ui-canvas';
import { useDesignStudio } from '../DesignStudioStore';
import { SelectionOverlay } from '../SelectionOverlay';
import { DesignLayoutTypesDataKey } from '../constants';
import { readLayoutTypeDragData } from '../utils';
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

  /**
   * Content rendered to the right of the name field.
   */
  nameAccessory?: React.ReactNode;
}

/**
 * Renders the zoomable/pannable viewport that wraps the design
 * canvas area, and creates layouts dropped onto it from the
 * layouts palette. Must be rendered within the design studio's
 * CanvasProvider.
 */
export const DesignStudioViewport: React.FC<DesignStudioViewportProps> = ({
  children,
  name,
  onNameChange,
  nameAccessory,
}) => {
  const studio = useDesignStudio();
  const transformLayerRef = useCanvasTransformLayer();

  // Clicking the empty canvas deactivates the layout and clears
  // the selection
  const handleBackgroundMouseDown = useCallback(() => {
    studio.setActiveLayout(null);
  }, [studio]);

  // Accept layout type drags, which the browser otherwise rejects
  const handleDragOver = useCallback((event: React.DragEvent) => {
    if (dragContainsType(event, [DesignLayoutTypesDataKey])) {
      event.preventDefault();
    }
  }, []);

  // Create a layout of the dropped type, with its frame's top left
  // corner at the drop point
  const handleDrop = useCallback(
    (event: React.DragEvent, canvasPoint: CanvasPoint) => {
      const design = studio.getDesign();

      if (!design) {
        return;
      }

      const dragData = readLayoutTypeDragData(event);

      // Drops carrying anything else are handled by the elements
      // they land on, not by the canvas
      if (!dragData) {
        return;
      }

      studio.addLayout(design.id, dragData.layoutType, canvasPoint);
    },
    [studio],
  );

  return (
    <Canvas
      className="designs-studio-viewport"
      shortcutScope="window"
      name={name}
      onNameChange={onNameChange}
      nameAccessory={nameAccessory}
      onBackgroundMouseDown={handleBackgroundMouseDown}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}
      <SelectionOverlay transformLayerRef={transformLayerRef} />
    </Canvas>
  );
};
