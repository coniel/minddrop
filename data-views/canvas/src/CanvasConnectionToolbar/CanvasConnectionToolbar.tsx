import { getConnectionColor } from '@minddrop/ui-canvas';
import { UiIconName } from '@minddrop/ui-icons';
import {
  DropdownMenuColorSelectionItem,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  Separator,
  Toolbar,
  ToolbarButton,
  ToolbarIconButton,
} from '@minddrop/ui-primitives';
import { ContentColor, ContentColors } from '@minddrop/ui-theme';
import { CanvasViewConnection } from '../types';
import './CanvasConnectionToolbar.css';

/**
 * Configuration changes applied to the selected connection via
 * the toolbar.
 */
export type CanvasConnectionChanges = Partial<
  Pick<
    CanvasViewConnection,
    'arrows' | 'shape' | 'color' | 'style' | 'thickness'
  >
>;

export interface CanvasConnectionToolbarProps {
  /**
   * The selected connections the toolbar configures as one.
   */
  connections: CanvasViewConnection[];

  /**
   * Called with the picked configuration changes, which apply to
   * every selected connection.
   */
  onConnectionChange: (changes: CanvasConnectionChanges) => void;

  /**
   * Called when the delete button is pressed.
   */
  onConnectionDelete: VoidFunction;
}

/** Trigger icon for each arrows setting. */
const ARROW_ICONS: Record<
  NonNullable<CanvasViewConnection['arrows']>,
  UiIconName
> = {
  none: 'minus',
  end: 'move-right',
  both: 'move-horizontal',
};

/** Trigger icon for each shape setting. */
const SHAPE_ICONS: Record<
  NonNullable<CanvasViewConnection['shape']>,
  UiIconName
> = {
  curved: 'spline',
  straight: 'corner-down-right',
  direct: 'slash',
};

/**
 * Renders the actions for the canvas's selected connections, with
 * dropdown menus configuring their arrowheads, line shape, style,
 * thickness and color, and a delete button. Menus show the value
 * shared across the selection, falling back to the first
 * connection's where they differ.
 */
export const CanvasConnectionToolbar: React.FC<
  CanvasConnectionToolbarProps
> = ({ connections, onConnectionChange, onConnectionDelete }) => {
  // The value each menu displays for the selection
  const arrows = sharedValue(connections, 'arrows', 'end');
  const shape = sharedValue(connections, 'shape', 'curved');
  const style = sharedValue(connections, 'style', 'solid');
  const thickness = sharedValue(connections, 'thickness', 'medium');
  const color = sharedValue(connections, 'color', 'default');

  // Set the arrows setting from the picked menu value
  function handleArrowsChange(value: string) {
    if (value === 'none' || value === 'end' || value === 'both') {
      onConnectionChange({ arrows: value });
    }
  }

  // Set the path shape from the picked menu value
  function handleShapeChange(value: string) {
    if (value === 'curved' || value === 'straight' || value === 'direct') {
      onConnectionChange({ shape: value });
    }
  }

  // Set the stroke color from the picked swatch
  function handleColorChange(color: ContentColor) {
    onConnectionChange({ color });
  }

  // Set the stroke style from the picked menu value
  function handleStyleChange(value: string) {
    if (value === 'solid' || value === 'dashed' || value === 'dotted') {
      onConnectionChange({ style: value });
    }
  }

  // Set the stroke thickness from the picked menu value
  function handleThicknessChange(value: string) {
    if (value === 'thin' || value === 'medium' || value === 'thick') {
      onConnectionChange({ thickness: value });
    }
  }

  return (
    <Toolbar className="canvas-view-connection-toolbar">
      {/* Arrowheads menu */}
      <DropdownMenuRoot>
        <DropdownMenuTrigger>
          <ToolbarIconButton
            icon={ARROW_ICONS[arrows]}
            label="dataViews.canvas.connectionArrows"
            tooltip={{ title: 'dataViews.canvas.connectionArrows' }}
            variant="ghost"
            size="sm"
          />
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuPositioner side="bottom" align="start">
            <DropdownMenuContent minWidth={190}>
              <DropdownMenuRadioGroup
                value={arrows}
                onValueChange={handleArrowsChange}
              >
                <DropdownMenuRadioItem
                  value="none"
                  icon="minus"
                  label="dataViews.canvas.connectionArrowsNone"
                />
                <DropdownMenuRadioItem
                  value="end"
                  icon="move-right"
                  label="dataViews.canvas.connectionArrowsEnd"
                />
                <DropdownMenuRadioItem
                  value="both"
                  icon="move-horizontal"
                  label="dataViews.canvas.connectionArrowsBoth"
                />
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenuPositioner>
        </DropdownMenuPortal>
      </DropdownMenuRoot>

      {/* Line shape menu */}
      <DropdownMenuRoot>
        <DropdownMenuTrigger>
          <ToolbarIconButton
            icon={SHAPE_ICONS[shape]}
            label="dataViews.canvas.connectionShape"
            tooltip={{ title: 'dataViews.canvas.connectionShape' }}
            variant="ghost"
            size="sm"
          />
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuPositioner side="bottom" align="start">
            <DropdownMenuContent minWidth={140}>
              <DropdownMenuRadioGroup
                value={shape}
                onValueChange={handleShapeChange}
              >
                <DropdownMenuRadioItem
                  value="curved"
                  icon="spline"
                  label="dataViews.canvas.connectionShapeCurved"
                />
                <DropdownMenuRadioItem
                  value="straight"
                  icon="corner-down-right"
                  label="dataViews.canvas.connectionShapeStraight"
                />
                <DropdownMenuRadioItem
                  value="direct"
                  icon="slash"
                  label="dataViews.canvas.connectionShapeDirect"
                />
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenuPositioner>
        </DropdownMenuPortal>
      </DropdownMenuRoot>

      {/* Line style menu */}
      <DropdownMenuRoot>
        <DropdownMenuTrigger>
          <ToolbarIconButton
            icon="circle-dashed"
            label="dataViews.canvas.connectionStyle"
            tooltip={{ title: 'dataViews.canvas.connectionStyle' }}
            variant="ghost"
            size="sm"
          />
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuPositioner side="bottom" align="start">
            <DropdownMenuContent minWidth={140}>
              <DropdownMenuRadioGroup
                value={style}
                onValueChange={handleStyleChange}
              >
                <DropdownMenuRadioItem
                  value="solid"
                  label="dataViews.canvas.connectionStyleSolid"
                />
                <DropdownMenuRadioItem
                  value="dashed"
                  label="dataViews.canvas.connectionStyleDashed"
                />
                <DropdownMenuRadioItem
                  value="dotted"
                  label="dataViews.canvas.connectionStyleDotted"
                />
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenuPositioner>
        </DropdownMenuPortal>
      </DropdownMenuRoot>

      {/* Line thickness menu */}
      <DropdownMenuRoot>
        <DropdownMenuTrigger>
          <ToolbarIconButton
            icon="equal"
            label="dataViews.canvas.connectionThickness"
            tooltip={{ title: 'dataViews.canvas.connectionThickness' }}
            variant="ghost"
            size="sm"
          />
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuPositioner side="bottom" align="start">
            <DropdownMenuContent minWidth={140}>
              <DropdownMenuRadioGroup
                value={thickness}
                onValueChange={handleThicknessChange}
              >
                <DropdownMenuRadioItem
                  value="thin"
                  label="dataViews.canvas.connectionThicknessThin"
                />
                <DropdownMenuRadioItem
                  value="medium"
                  label="dataViews.canvas.connectionThicknessMedium"
                />
                <DropdownMenuRadioItem
                  value="thick"
                  label="dataViews.canvas.connectionThicknessThick"
                />
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenuPositioner>
        </DropdownMenuPortal>
      </DropdownMenuRoot>

      {/* Color menu */}
      <DropdownMenuRoot>
        <DropdownMenuTrigger>
          <ToolbarButton
            size="sm"
            variant="ghost"
            className="canvas-view-connection-toolbar-color-button"
          >
            {/* Swatch showing the current color */}
            <span
              className="canvas-view-connection-toolbar-swatch"
              style={{
                backgroundColor: getConnectionColor(color),
              }}
            />
          </ToolbarButton>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuPositioner side="bottom" align="start">
            <DropdownMenuContent minWidth={160}>
              {ContentColors.map((color) => (
                <DropdownMenuColorSelectionItem
                  key={color}
                  color={color}
                  onClick={() => handleColorChange(color)}
                />
              ))}
            </DropdownMenuContent>
          </DropdownMenuPositioner>
        </DropdownMenuPortal>
      </DropdownMenuRoot>

      <Separator orientation="vertical" />

      {/* Delete button */}
      <ToolbarIconButton
        icon="trash"
        label="dataViews.canvas.connectionDelete"
        tooltip={{ title: 'dataViews.canvas.connectionDelete' }}
        variant="ghost"
        size="sm"
        onClick={onConnectionDelete}
      />
    </Toolbar>
  );
};

/**
 * Returns the value a setting shares across the selection, or the
 * first connection's value when they differ.
 */
function sharedValue<TKey extends keyof CanvasConnectionChanges>(
  connections: CanvasViewConnection[],
  key: TKey,
  fallback: NonNullable<CanvasViewConnection[TKey]>,
): NonNullable<CanvasViewConnection[TKey]> {
  // No connection to read a value from
  if (!connections.length) {
    return fallback;
  }

  return connections[0][key] ?? fallback;
}
