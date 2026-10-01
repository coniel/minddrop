import { useCallback, useRef, useState } from 'react';
import { Designs } from '@minddrop/designs-next';
import { useTranslation } from '@minddrop/i18n';
import { PropertiesSchema } from '@minddrop/properties';
import {
  FloatingToolbar,
  RadioToggleGroup,
  Toggle,
  useOutsideClick,
  usePopupDismissPress,
} from '@minddrop/ui-primitives';
import { useElementWidth } from '@minddrop/utils';
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
   * The snap resolution the editor opens with, in grid units.
   */
  defaultSnap: number;

  /**
   * The design's own layout controls, floating at the canvas' top
   * right beside the snap and zoom controls.
   */
  layoutControls?: React.ReactNode;

  /**
   * The design's own controls. Shown in place of the selected
   * element's controls while nothing is selected.
   */
  designControls?: React.ReactNode;

  /**
   * Whether the design is aspect-locked, offering element height
   * modes instead of the natural height toggle.
   */
  aspectLocked?: boolean;

  /**
   * Whether the block editor fills the pane's width, scaling its
   * grid to fit, in place of the zoomable canvas.
   */
  fill?: boolean;

  /**
   * The properties the design's elements can map to, offered as
   * the content of elements which take one.
   */
  properties?: PropertiesSchema;
}

/**
 * Renders a design's block editor with its controls.
 */
export const DesignEditorPane: React.FC<DesignEditorPaneProps> = ({
  defaultSnap,
  layoutControls,
  designControls,
  aspectLocked = false,
  fill = false,
  properties,
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
  const [snap, setSnap] = useState(defaultSnap);
  const [layoutElement, setLayoutElement] = useState<HTMLDivElement | null>(
    null,
  );
  const wasDismissingPopup = usePopupDismissPress();
  const layoutWidth = useElementWidth(layoutElement);
  const { t } = useTranslation();

  // The rendered size of a grid unit: the design size on the canvas,
  // which zooms it, or the room the filled pane gives each column
  // once it has been measured.
  const unitSize =
    fill && layoutWidth
      ? layoutWidth / columns
      : Designs.constants.UnitPixelSize;

  // Clears the selection, both on canvas background presses and on
  // clicks landing outside the pane, which the block toolbar
  // floating over the canvas is part of.
  const handleDeselect = useCallback(() => {
    // A press which closed a menu or popover has done its job. It
    // leaves the element it was configuring selected.
    if (wasDismissingPopup()) {
      return;
    }

    onSelectionChange(null);
  }, [onSelectionChange, wasDismissingPopup]);

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
      fill={fill}
      onBackgroundPress={handleDeselect}
      sideControls={
        // The design's own controls while nothing is selected
        selectedId === null ? (
          designControls
        ) : (
          <DesignElementControls
            elements={elements}
            selectedId={selectedId}
            rows={rows}
            properties={properties}
            aspectLocked={aspectLocked}
            onElementsChange={onElementsChange}
            onRowsChange={onRowsChange}
          />
        )
      }
      controls={
        <>
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

          {layoutControls}
        </>
      }
    >
      {/* Measured for the room the filled pane gives the grid */}
      <div ref={setLayoutElement}>
        <DesignBlockEditor
          {...blockEditorProps}
          elements={elements}
          columns={columns}
          rows={rows}
          selectedId={selectedId}
          snap={snap}
          unitSize={unitSize}
          onElementsChange={onElementsChange}
          onSelectionChange={onSelectionChange}
          onRowsChange={onRowsChange}
        />
      </div>
    </DesignCanvasPane>
  );
};
