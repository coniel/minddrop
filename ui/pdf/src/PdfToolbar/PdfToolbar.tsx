import { useTranslation } from '@minddrop/i18n';
import { PdfZoom } from '@minddrop/pdf';
import {
  Select,
  SelectOption,
  Text,
  ToolbarIconButton,
  ToolbarSeparator,
  ViewFloatingToolbar,
} from '@minddrop/ui-primitives';
import { ZoomPresets } from '../constants';
import { parsePdfZoom, resolveZoomStep, stringifyPdfZoom } from '../utils';
import './PdfToolbar.css';

export interface PdfToolbarProps {
  /**
   * The page the viewer is on, 1-based.
   */
  page: number;

  /**
   * The number of pages in the document.
   */
  pageCount: number;

  /**
   * The zoom the pages render at.
   */
  zoom: PdfZoom;

  /**
   * The zoom the pages render at, as a multiple of their physical
   * size. The zoom steps step from this. Differs from `zoom` in the
   * fit modes.
   */
  resolvedZoom: number;

  /**
   * Called with the page to show when one is picked.
   */
  onPageChange: (page: number) => void;

  /**
   * Called with the zoom to render at when one is picked.
   */
  onZoomChange: (zoom: PdfZoom) => void;

  /**
   * Whether the toolbar is always shown. When false, it is revealed
   * while its host is hovered.
   * @default false
   */
  visible?: boolean;

  /**
   * Further actions, rendered after the zoom controls.
   */
  children?: React.ReactNode;
}

// The zoom options
const ZoomOptions: SelectOption<string>[] = [
  // The fit modes
  { value: 'fit-width', label: 'pdf.zoom.fitWidth' },
  { value: 'fit-page', label: 'pdf.zoom.fitPage' },
  // The presets, as percentages
  ...ZoomPresets.map((preset) => ({
    value: stringifyPdfZoom(preset),
    stringLabel: `${Math.round(preset * 100)}%`,
  })),
];

/**
 * Renders a PDF viewer's floating toolbar.
 */
export const PdfToolbar: React.FC<PdfToolbarProps> = ({
  page,
  pageCount,
  zoom,
  resolvedZoom,
  onPageChange,
  onZoomChange,
  visible = false,
  children,
}) => {
  const { t } = useTranslation();

  // Resolve the zoom presets one step in and out, null at the ends
  const zoomInStep = resolveZoomStep(resolvedZoom, 'in');
  const zoomOutStep = resolveZoomStep(resolvedZoom, 'out');

  // Render at the picked zoom
  function handleZoomSelect(value: string) {
    onZoomChange(parsePdfZoom(value));
  }

  // Step the zoom in
  function handleZoomIn() {
    if (zoomInStep !== null) {
      onZoomChange(zoomInStep);
    }
  }

  // Step the zoom out
  function handleZoomOut() {
    if (zoomOutStep !== null) {
      onZoomChange(zoomOutStep);
    }
  }

  return (
    <ViewFloatingToolbar
      className="pdf-toolbar"
      position="absolute"
      size="sm"
      visible={visible}
    >
      {/* Page position */}
      <ToolbarIconButton
        icon="chevron-left"
        label="pdf.toolbar.previousPage"
        size="xs"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      />
      <Text
        className="pdf-toolbar-page"
        size="xs"
        stringText={t('pdf.toolbar.pageOf', { page, count: pageCount })}
      />
      <ToolbarIconButton
        icon="chevron-right"
        label="pdf.toolbar.nextPage"
        size="xs"
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
      />

      <ToolbarSeparator />

      {/* Zoom */}
      <Select
        className="pdf-toolbar-zoom"
        size="sm"
        variant="ghost"
        valueColor="regular"
        options={ZoomOptions}
        value={stringifyPdfZoom(zoom)}
        onValueChange={handleZoomSelect}
      />
      <ToolbarIconButton
        icon="zoom-out"
        label="pdf.toolbar.zoomOut"
        size="xs"
        disabled={zoomOutStep === null}
        onClick={handleZoomOut}
      />
      <ToolbarIconButton
        icon="zoom-in"
        label="pdf.toolbar.zoomIn"
        size="xs"
        disabled={zoomInStep === null}
        onClick={handleZoomIn}
      />

      {/* Further actions */}
      {children && (
        <>
          <ToolbarSeparator />
          {children}
        </>
      )}
    </ViewFloatingToolbar>
  );
};
