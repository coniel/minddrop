import { useEffect, useState } from 'react';
import { TranslationKey } from '@minddrop/i18n';
import { CanvasFrameAlignment } from '@minddrop/ui-canvas';
import { UiIconName } from '@minddrop/ui-icons';
import { Separator, Toolbar, ToolbarIconButton } from '@minddrop/ui-primitives';
import './CanvasNodeSelectionToolbar.css';

export interface CanvasNodeSelectionToolbarProps {
  /**
   * Whether the alignment actions are shown. A single node has
   * nothing to align against.
   */
  alignable: boolean;

  /**
   * Called with the alignment to apply to the selected nodes.
   */
  onAlign: (alignment: CanvasFrameAlignment) => void;

  /**
   * Called when the remove button is pressed, with whether shift
   * was held.
   */
  onDelete: (options: { shiftKey: boolean }) => void;
}

/**
 * The icon and label of each alignment action, in toolbar order.
 */
const ALIGNMENTS: {
  alignment: CanvasFrameAlignment;
  icon: UiIconName;
  label: TranslationKey;
}[] = [
  {
    alignment: 'left',
    icon: 'align-start-vertical',
    label: 'dataViews.canvas.alignLeft',
  },
  {
    alignment: 'center',
    icon: 'align-center-vertical',
    label: 'dataViews.canvas.alignCenter',
  },
  {
    alignment: 'right',
    icon: 'align-end-vertical',
    label: 'dataViews.canvas.alignRight',
  },
  {
    alignment: 'top',
    icon: 'align-start-horizontal',
    label: 'dataViews.canvas.alignTop',
  },
  {
    alignment: 'middle',
    icon: 'align-center-horizontal',
    label: 'dataViews.canvas.alignMiddle',
  },
  {
    alignment: 'bottom',
    icon: 'align-end-horizontal',
    label: 'dataViews.canvas.alignBottom',
  },
];

/**
 * Renders the actions for the canvas's selected nodes: aligning
 * them along an edge or axis of their shared bounds, and removing
 * them from the canvas.
 */
export const CanvasNodeSelectionToolbar: React.FC<
  CanvasNodeSelectionToolbarProps
> = ({ alignable, onAlign, onDelete }) => {
  const [shiftHeld, setShiftHeld] = useState(false);

  // Track shift so the remove button can show that the press
  // would delete rather than remove
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      setShiftHeld(event.shiftKey);
    };

    // Shift released while the window is unfocused never reaches
    // the keyup listener, which would leave the button stuck
    const handleBlur = () => {
      setShiftHeld(false);
    };

    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKey);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('keyup', handleKey);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Shift escalates the removal to deleting the entries
  function handleDelete(event: React.MouseEvent) {
    onDelete({ shiftKey: event.shiftKey });
  }

  return (
    <Toolbar className="canvas-view-node-selection-toolbar">
      {/* Alignment actions, for a group of nodes */}
      {alignable &&
        ALIGNMENTS.map(({ alignment, icon, label }) => (
          <ToolbarIconButton
            key={alignment}
            icon={icon}
            label={label}
            tooltip={{ title: label }}
            variant="ghost"
            size="sm"
            onClick={() => onAlign(alignment)}
          />
        ))}

      {alignable && <Separator orientation="vertical" />}

      {/* Remove the selected nodes from the canvas, or delete
        their entries when shift is held */}
      <ToolbarIconButton
        icon="trash"
        label="dataViews.canvas.removeNodes"
        tooltip={{
          title: 'dataViews.canvas.removeNodes',
          description: 'dataViews.canvas.removeNodesHint',
        }}
        variant="ghost"
        size="sm"
        danger={shiftHeld ? 'always' : undefined}
        onClick={handleDelete}
      />
    </Toolbar>
  );
};
