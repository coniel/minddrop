import { useRef, useState } from 'react';
import {
  AspectRatioToken,
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
import {
  PreviewWidthPresets,
  PreviewWidthToggles,
} from './PreviewWidthToggles';

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

// The preview width card designs open at
const DefaultPreviewWidth = PreviewWidthPresets[1].width;

// The elements shown while the design is missing
const NoElements: DesignElement[] = [];

/**
 * Renders the design editing surface: the editor pane and the
 * preview pane side by side, with the card design's options in their
 * controls. Drags edit a draft which commits to the design when
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
  const [previewWidth, setPreviewWidth] = useState<number>(DefaultPreviewWidth);
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

  return (
    <div className="design-editor">
      <DesignEditorPane
        properties={properties}
        elements={elements}
        columns={columns}
        rows={rows}
        selectedId={selectedId}
        aspectLocked={Boolean(design.aspectRatio)}
        layoutControls={
          <AspectRatioMenu
            aspectRatio={design.aspectRatio}
            onAspectRatioChange={handleAspectRatioChange}
          />
        }
        onElementsChange={handleElementsChange}
        onSelectionChange={setSelectedId}
        onRowsChange={design.aspectRatio ? undefined : handleRowsChange}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />

      <DesignPreviewPane
        width={previewWidth}
        scheme={scheme}
        leadingControls={previewControls}
        controls={
          <PreviewWidthToggles
            width={previewWidth}
            onWidthChange={setPreviewWidth}
          />
        }
      >
        <DesignRenderer
          design={renderedDesign}
          width={previewWidth}
          properties={properties}
          values={values}
        />
      </DesignPreviewPane>
    </div>
  );
};
