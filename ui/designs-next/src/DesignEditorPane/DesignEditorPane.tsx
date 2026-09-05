import { useState } from 'react';
import { SnapPresets, UnitPixelSize } from '@minddrop/designs-next';
import { useTranslation } from '@minddrop/i18n';
import {
  FloatingToolbar,
  RadioToggleGroup,
  Toggle,
} from '@minddrop/ui-primitives';
import {
  DesignBlockEditor,
  DesignBlockEditorProps,
} from '../DesignBlockEditor';
import { DesignCanvasPane } from '../DesignCanvasPane';
import './DesignEditorPane.css';

export interface DesignEditorPaneProps
  extends Omit<DesignBlockEditorProps, 'snap' | 'unitSize'> {
  /**
   * Toolbars floating at the pane's top right, left of the snap and
   * zoom controls, for the design type's own editing options.
   */
  controls?: React.ReactNode;
}

// The snap resolution the editor opens with, in grid units
const DefaultSnap = 2;

/**
 * Renders the editing side of a design: the block editor on a
 * zoomable canvas, with the snap resolution toggles and the canvas
 * zoom controls floating above it.
 */
export const DesignEditorPane: React.FC<DesignEditorPaneProps> = ({
  controls,
  columns,
  rows,
  ...blockEditorProps
}) => {
  const [snap, setSnap] = useState(DefaultSnap);
  const { t } = useTranslation();

  // Changes the snap resolution
  function handleSnapChange(value: string) {
    setSnap(Number(value));
  }

  return (
    <DesignCanvasPane
      className="design-editor-pane"
      layoutWidth={columns * UnitPixelSize}
      layoutHeight={rows * UnitPixelSize}
      controls={
        <>
          {controls}

          {/* Snap resolution toggles */}
          <FloatingToolbar size="md" visible>
            <RadioToggleGroup
              size="sm"
              value={String(snap)}
              onValueChange={handleSnapChange}
            >
              {SnapPresets.map((units) => (
                <Toggle
                  key={units}
                  size="sm"
                  value={String(units)}
                  label={`${units * UnitPixelSize}px`}
                  tooltip={{
                    stringTitle: t('designsNext.editor.snapTo', {
                      size: `${units * UnitPixelSize}px`,
                    }),
                  }}
                >
                  {units * UnitPixelSize}
                </Toggle>
              ))}
            </RadioToggleGroup>
          </FloatingToolbar>
        </>
      }
    >
      <DesignBlockEditor
        {...blockEditorProps}
        columns={columns}
        rows={rows}
        snap={snap}
        unitSize={UnitPixelSize}
      />
    </DesignCanvasPane>
  );
};
