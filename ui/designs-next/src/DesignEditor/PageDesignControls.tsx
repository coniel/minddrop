import { ContentWidth } from '@minddrop/designs-next';
import { FloatingToolbar } from '@minddrop/ui-primitives';
import { ContentWidthControl } from './ContentWidthControl';

export interface PageDesignControlsProps {
  /**
   * The design's content width, or undefined for full width.
   */
  contentWidth?: ContentWidth;

  /**
   * The design's side padding in pixels, or undefined for none.
   */
  sidePadding?: number;

  /**
   * Callback fired with the picked content width, or null for full
   * width.
   */
  onContentWidthChange: (contentWidth: ContentWidth | null) => void;

  /**
   * Callback fired with the picked side padding in pixels.
   */
  onSidePaddingChange: (sidePadding: number) => void;
}

/**
 * Renders a page design's own controls as a vertical toolbar.
 */
export const PageDesignControls: React.FC<PageDesignControlsProps> = ({
  contentWidth,
  sidePadding,
  onContentWidthChange,
  onSidePaddingChange,
}) => (
  <FloatingToolbar size="md" visible orientation="vertical">
    <ContentWidthControl
      contentWidth={contentWidth}
      sidePadding={sidePadding}
      onContentWidthChange={onContentWidthChange}
      onSidePaddingChange={onSidePaddingChange}
    />
  </FloatingToolbar>
);
