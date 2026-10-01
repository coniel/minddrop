import { createI18nKeyBuilder } from '@minddrop/i18n';
import { PdfAnnotationColor, PdfAnnotations } from '@minddrop/pdf';
import {
  ContentColorSwatch,
  FloatingToolbar,
  ToolbarIconButton,
  ToolbarSeparator,
} from '@minddrop/ui-primitives';
import { PdfClientRect } from '../types';
import './PdfAnnotationToolbar.css';

export interface PdfAnnotationToolbarProps {
  /**
   * The box the toolbar floats under, in the document column's
   * CSS pixels.
   */
  anchor: PdfClientRect;

  /**
   * The colour of the annotation the toolbar acts on, marked among
   * the swatches. Omitted while the toolbar acts on a selection
   * which is not an annotation yet.
   */
  color?: PdfAnnotationColor;

  /**
   * Called with the colour picked from the swatches.
   */
  onColorPick: (color: PdfAnnotationColor) => void;

  /**
   * Called when the delete action is pressed. Omitted to offer no
   * delete action.
   */
  onDelete?: () => void;

  /**
   * Further actions rendered after the swatches.
   */
  children?: React.ReactNode;
}

// Builds the translation key of a colour's label
const colorLabelKey = createI18nKeyBuilder('color.');

/**
 * Renders the toolbar floating under a text selection or a selected
 * highlight.
 */
export const PdfAnnotationToolbar: React.FC<PdfAnnotationToolbarProps> = ({
  anchor,
  color,
  onColorPick,
  onDelete,
  children,
}) => {
  // Keep the text selection the toolbar acts on. A press would
  // otherwise collapse it.
  function handleMouseDown(event: React.MouseEvent) {
    event.preventDefault();
  }

  return (
    <div
      className="pdf-annotation-toolbar-anchor"
      style={
        {
          '--pdf-annotation-toolbar-left': `${anchor.left + anchor.width / 2}px`,
          '--pdf-annotation-toolbar-top': `${anchor.top + anchor.height}px`,
        } as React.CSSProperties
      }
      onMouseDown={handleMouseDown}
    >
      <FloatingToolbar className="pdf-annotation-toolbar" size="sm" visible>
        {/* Colours */}
        {PdfAnnotations.constants.Colors.map((swatchColor) => (
          <ToolbarIconButton
            key={swatchColor}
            size="sm"
            label={colorLabelKey(swatchColor)}
            tooltip={{ title: colorLabelKey(swatchColor) }}
            active={swatchColor === color}
            onClick={() => onColorPick(swatchColor)}
          >
            <ContentColorSwatch color={swatchColor} size="lg" />
          </ToolbarIconButton>
        ))}

        {/* Delete */}
        {onDelete && (
          <>
            <ToolbarSeparator />
            <ToolbarIconButton
              icon="trash-2"
              size="sm"
              label="pdf.annotations.delete"
              danger="on-hover"
              onClick={onDelete}
            />
          </>
        )}

        {/* Further actions */}
        {children && (
          <>
            <ToolbarSeparator />
            {children}
          </>
        )}
      </FloatingToolbar>
    </div>
  );
};
