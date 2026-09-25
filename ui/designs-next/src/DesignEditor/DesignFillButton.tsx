import { FloatingToolbar, ToolbarIconButton } from '@minddrop/ui-primitives';

export interface DesignFillButtonProps {
  /**
   * Whether the design fills the editor's panes.
   */
  fill: boolean;

  /**
   * Callback fired with whether the design should fill the panes.
   */
  onFillChange: (fill: boolean) => void;
}

/**
 * Renders the button switching the editor's panes between filling
 * their width and the zoomable canvas, as a floating toolbar.
 */
export const DesignFillButton: React.FC<DesignFillButtonProps> = ({
  fill,
  onFillChange,
}) => {
  // The button names the mode it switches to
  const label = fill
    ? 'designsNext.editor.layout.canvas'
    : 'designsNext.editor.layout.fill';

  // Switches to the other mode
  function handleClick() {
    onFillChange(!fill);
  }

  return (
    <FloatingToolbar size="md" visible>
      <ToolbarIconButton
        icon={fill ? 'shrink' : 'expand'}
        label={label}
        tooltip={{ title: label }}
        variant="subtle"
        size="sm"
        onClick={handleClick}
      />
    </FloatingToolbar>
  );
};
