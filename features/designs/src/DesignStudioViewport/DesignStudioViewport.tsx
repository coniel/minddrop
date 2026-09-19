import { useCallback } from 'react';
import { DropEventData, Selection } from '@minddrop/selection';
import {
  Canvas,
  useCanvas,
  useCanvasTransformLayer,
} from '@minddrop/ui-canvas';
import { useDesignStudio } from '../DesignStudioStore';
import { SelectionOverlay } from '../SelectionOverlay';
import { DesignLayoutTypesDataKey } from '../constants';
import { resolveLayoutTypeDragData } from '../utils';
import './DesignStudioViewport.css';

// The data types the viewport accepts drops of
const ACCEPTED_DATA_TYPES = [DesignLayoutTypesDataKey];

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
  const canvas = useCanvas();
  const transformLayerRef = useCanvasTransformLayer();

  // Clicking the empty canvas deactivates the layout and clears
  // the selection.
  const handleBackgroundMouseDown = useCallback(() => {
    studio.setActiveLayout(null);
  }, [studio]);

  // Create a layout of the dropped type, with its frame's top left
  // corner at the drop point.
  const handleDrop = useCallback(
    (drop: DropEventData) => {
      // Read the design being edited
      const design = studio.getDesign();

      if (!design) {
        return;
      }

      // Resolve the dragged layout type
      const dragData = resolveLayoutTypeDragData(drop.data);

      if (!dragData) {
        return;
      }

      // Add the layout with its top left corner at the drop point
      studio.addLayout(
        design.id,
        dragData.layoutType,
        canvas.clientToCanvas({ x: drop.clientX, y: drop.clientY }),
      );
    },
    [studio, canvas],
  );

  // Register the viewport as a drop target for layout types
  const { droppableProps } = Selection.useDroppable({
    type: 'design-studio-viewport',
    id: 'viewport',
    accepts: ACCEPTED_DATA_TYPES,
    onDrop: handleDrop,
  });

  return (
    <div className="designs-studio-viewport-drop-target" {...droppableProps}>
      <Canvas
        className="designs-studio-viewport"
        shortcutScope="window"
        name={name}
        onNameChange={onNameChange}
        nameAccessory={nameAccessory}
        onBackgroundMouseDown={handleBackgroundMouseDown}
      >
        {children}
        <SelectionOverlay transformLayerRef={transformLayerRef} />
      </Canvas>
    </div>
  );
};
