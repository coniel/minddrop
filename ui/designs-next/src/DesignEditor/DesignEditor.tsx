import { useRef, useState } from 'react';
import {
  AspectRatioToken,
  ContentWidth,
  DesignElement,
  Designs,
} from '@minddrop/designs-next';
import { PropertiesSchema, PropertyMap } from '@minddrop/properties';
import { ContentColor } from '@minddrop/ui-theme';
import { DesignEditorPane } from '../DesignEditorPane';
import { DesignPreviewPane } from '../DesignPreviewPane';
import { DesignRenderer } from '../DesignRenderer';
import { AspectRatioMenu } from './AspectRatioMenu';
import './DesignEditor.css';
import { DesignFillButton } from './DesignFillButton';
import { PageDesignControls } from './PageDesignControls';
import { PreviewWidthToggles, PreviewWidths } from './PreviewWidthToggles';

export interface DesignEditorProps {
  /**
   * The ID of the design to edit.
   */
  designId: string;

  /**
   * The properties the design's elements can map to, offered as
   * the content of elements which take one.
   */
  properties?: PropertiesSchema;

  /**
   * The property values the preview renders, keyed by property
   * name. Elements mapped to a property without a value here fall
   * back to their own content.
   */
  values?: PropertyMap;

  /**
   * The scheme hue the preview renders with. Left to the owner,
   * which knows whether what it renders carries a colour at all.
   */
  scheme?: ContentColor | null;

  /**
   * Toolbars rendered at the left end of the preview's controls,
   * for the owner's own preview options such as the entry it
   * renders and the colour it renders with.
   */
  previewControls?: React.ReactNode;
}

interface Draft {
  /**
   * The elements as they are mid-drag.
   */
  elements: DesignElement[];

  /**
   * The row count as it is mid-drag.
   */
  rows: number;
}

// The elements shown while the design is missing
const NoElements: DesignElement[] = [];

/**
 * Renders the design editing surface: the editor pane and the
 * preview pane side by side, with the design type's options in their
 * controls. Page designs fill the panes until switched to the
 * canvas. Drags edit a draft which commits to the design when
 * released; every other change commits immediately.
 */
export const DesignEditor: React.FC<DesignEditorProps> = ({
  designId,
  properties,
  values,
  scheme,
  previewControls,
}) => {
  const draggingRef = useRef(false);
  const draftRef = useRef<Draft | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pickedPreviewWidth, setPickedPreviewWidth] = useState<number | null>(
    null,
  );
  const [fillPicked, setFillPicked] = useState(true);
  const design = Designs.use(designId);

  // The draft takes over from the design during drags
  const elements = draft?.elements ?? design?.elements ?? NoElements;
  const rows = draft?.rows ?? design?.rows ?? Designs.constants.MinRows;

  // Keep the latest draft reachable from the drag end handler
  draftRef.current = draft;

  if (!design) {
    return null;
  }

  // The design's fixed unit width
  const { columns } = design;

  // Check if the design is a page or a space. These are always auto
  // height, so they fill the panes in place of an aspect ratio. They
  // also have a content width and side padding of their own.
  const fillable = design.type === 'page' || design.type === 'space';
  const fill = fillable && fillPicked;

  // The preview widths offered for the design type, and the width
  // the preview renders at, opening at the design's own.
  const previewWidths = PreviewWidths[design.type];
  const previewWidth = pickedPreviewWidth ?? previewWidths[1];

  // The design as rendered, with the draft applied
  const renderedDesign = { ...design, elements, rows };

  // Applies live element changes to the draft during drags and
  // commits them otherwise.
  function handleElementsChange(changed: DesignElement[]) {
    if (draggingRef.current) {
      setDraft((current) => ({
        elements: changed,
        rows: current?.rows ?? rows,
      }));

      return;
    }

    Designs.update(designId, { elements: changed });
  }

  // Applies live row changes to the draft during drags and commits
  // them otherwise.
  function handleRowsChange(changed: number) {
    if (draggingRef.current) {
      setDraft((current) => ({
        elements: current?.elements ?? elements,
        rows: changed,
      }));

      return;
    }

    Designs.update(designId, { rows: changed });
  }

  // Opens a draft for the drag
  function handleDragStart() {
    draggingRef.current = true;
    setDraft({ elements, rows });
  }

  // Commits the draft and closes it
  function handleDragEnd() {
    draggingRef.current = false;

    if (draftRef.current) {
      Designs.update(designId, draftRef.current);
    }

    setDraft(null);
  }

  // Changes the aspect ratio, deriving the rows from it. Returning
  // to a natural-height design fits the rows to the content, since
  // blocks may have been placed below the pre-lock height while the
  // ratio held the design taller.
  function handleAspectRatioChange(aspectRatio: AspectRatioToken | null) {
    if (!aspectRatio) {
      // The lowest element bottom edge
      const contentBottom = elements.reduce(
        (bottom, element) => Math.max(bottom, element.row + element.rowSpan),
        0,
      );

      Designs.update(designId, {
        aspectRatio: null,
        rows: Math.max(contentBottom, Designs.constants.MinRows),
      });

      return;
    }

    Designs.update(designId, {
      aspectRatio,
      rows: Designs.resolveAspectRows(columns, aspectRatio),
    });
  }

  // Sets the picked content width
  function handleContentWidthChange(contentWidth: ContentWidth | null) {
    Designs.setContentWidth(designId, contentWidth);
  }

  // Changes the side padding, dropping it at none
  function handleSidePaddingChange(sidePadding: number) {
    Designs.update(designId, { sidePadding: sidePadding || null });
  }

  return (
    <div className="design-editor">
      <DesignEditorPane
        properties={properties}
        elements={elements}
        columns={columns}
        rows={rows}
        selectedId={selectedId}
        aspectLocked={Boolean(design.aspectRatio)}
        fill={fill}
        defaultSnap={Designs.constants.TypeSnaps[design.type]}
        designControls={
          // Page designs have controls of their own
          fillable && (
            <PageDesignControls
              contentWidth={design.contentWidth}
              sidePadding={design.sidePadding}
              onContentWidthChange={handleContentWidthChange}
              onSidePaddingChange={handleSidePaddingChange}
            />
          )
        }
        layoutControls={
          fillable ? (
            <DesignFillButton fill={fill} onFillChange={setFillPicked} />
          ) : (
            <AspectRatioMenu
              aspectRatio={design.aspectRatio}
              onAspectRatioChange={handleAspectRatioChange}
            />
          )
        }
        onElementsChange={handleElementsChange}
        onSelectionChange={setSelectedId}
        onRowsChange={design.aspectRatio ? undefined : handleRowsChange}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />

      <DesignPreviewPane
        width={previewWidth}
        fill={fill}
        scheme={scheme}
        leadingControls={previewControls}
        controls={
          // The filled pane decides the width
          !fill && (
            <PreviewWidthToggles
              widths={previewWidths}
              width={previewWidth}
              onWidthChange={setPickedPreviewWidth}
            />
          )
        }
      >
        <DesignRenderer
          design={renderedDesign}
          properties={properties}
          values={values}
        />
      </DesignPreviewPane>
    </div>
  );
};
