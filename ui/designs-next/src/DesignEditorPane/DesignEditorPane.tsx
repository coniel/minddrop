import { useCallback, useRef, useState } from 'react';
import { Designs } from '@minddrop/designs-next';
import { useTranslation } from '@minddrop/i18n';
import {
  FloatingToolbar,
  RadioToggleGroup,
  Toggle,
  useOutsideClick,
} from '@minddrop/ui-primitives';
import {
  DesignBlockEditor,
  DesignBlockEditorProps,
} from '../DesignBlockEditor';
import { DesignCanvasPane } from '../DesignCanvasPane';
import { DesignElementControls } from '../DesignElementControls';
import './DesignEditorPane.css';

export interface DesignEditorPaneProps
  extends Omit<DesignBlockEditorProps, 'snap' | 'unitSize'> {
  /**
   * The design's own layout controls, floating at the canvas' top
   * right beside the snap and zoom controls.
   */
  layoutControls?: React.ReactNode;

  /**
   * Whether the design is aspect-locked, offering element height
   * modes instead of the natural height toggle.
   */
  aspectLocked?: boolean;
}

// The snap resolution the editor opens with, in grid units
const DefaultSnap = 2;

/**
 * Renders the editing side of a design: the block editor on a
 * zoomable canvas, with the selected element's controls in a
 * vertical toolbar at the canvas' left edge and the layout, snap
 * resolution and canvas zoom controls floating at its top right.
 */
export const DesignEditorPane: React.FC<DesignEditorPaneProps> = ({
  layoutControls,
  aspectLocked = false,
  elements,
  columns,
  rows,
  selectedId,
  onElementsChange,
  onSelectionChange,
  onRowsChange,
  ...blockEditorProps
}) => {
  const paneRef = useRef<HTMLElement>(null);
  const [snap, setSnap] = useState(DefaultSnap);
  const { t } = useTranslation();

  // Clears the selection, both on canvas background presses and on
  // clicks landing outside the pane, which the block toolbar
  // floating over the canvas is part of.
  const handleDeselect = useCallback(
    () => onSelectionChange(null),
    [onSelectionChange],
  );

  useOutsideClick(paneRef, handleDeselect, selectedId !== null);

  // Changes the snap resolution
  function handleSnapChange(value: string) {
    setSnap(Number(value));
  }

  return (
    <DesignCanvasPane
      ref={paneRef}
      className="design-editor-pane"
      layoutWidth={columns * Designs.constants.UnitPixelSize}
      layoutHeight={rows * Designs.constants.UnitPixelSize}
      onBackgroundPress={handleDeselect}
      sideControls={
        <DesignElementControls
          elements={elements}
          selectedId={selectedId}
          rows={rows}
          aspectLocked={aspectLocked}
          onElementsChange={onElementsChange}
          onRowsChange={onRowsChange}
        />
      }
      controls={
        <>
          {layoutControls}

          {/* Snap resolution toggles */}
          <FloatingToolbar size="md" visible>
            <RadioToggleGroup
              size="sm"
              value={String(snap)}
              onValueChange={handleSnapChange}
            >
              {Designs.constants.SnapPresets.map((units) => (
                <Toggle
                  key={units}
                  size="sm"
                  value={String(units)}
                  label={`${units * Designs.constants.UnitPixelSize}px`}
                  tooltip={{
                    stringTitle: t('designsNext.editor.snapTo', {
                      size: `${units * Designs.constants.UnitPixelSize}px`,
                    }),
                  }}
                >
                  {units * Designs.constants.UnitPixelSize}
                </Toggle>
              ))}
            </RadioToggleGroup>
          </FloatingToolbar>
        </>
      }
    >
      <DesignBlockEditor
        {...blockEditorProps}
        elements={elements}
        columns={columns}
        rows={rows}
        selectedId={selectedId}
        snap={snap}
        unitSize={Designs.constants.UnitPixelSize}
        onElementsChange={onElementsChange}
        onSelectionChange={onSelectionChange}
        onRowsChange={onRowsChange}
      />
    </DesignCanvasPane>
  );
};
