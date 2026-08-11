import { useCallback, useMemo, useState } from 'react';
import { PlaceholderImageDialog } from '../../style-editors/PlaceholderImageField/PlaceholderImageDialog';
import { FlatImageViewerElement } from '../../types';
import { setElementImage } from '../../utils';
import { ImageViewerDesignElement } from './ImageViewerDesignElement';

export interface ImageViewerStudioDesignElementProps {
  /**
   * The image viewer element to render in the studio.
   */
  element: FlatImageViewerElement;

  /**
   * Props to spread on the outermost DOM element for
   * drag-and-drop and click-to-select behaviour.
   */
  rootProps: Record<string, unknown>;
}

/**
 * Renders an image viewer element in the design studio.
 * Wraps ImageViewerDesignElement with interactive placeholder
 * image selection via double-click.
 */
export const ImageViewerStudioDesignElement: React.FC<
  ImageViewerStudioDesignElementProps
> = ({ element, rootProps }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  // Handles selecting an image from the dialog
  const handleImageSelect = useCallback(
    (fileName: string) => {
      setElementImage(element.id, fileName);
    },
    [element.id],
  );

  // Merge double-click handler into rootProps
  const mergedRootProps = useMemo(
    () => ({ ...rootProps, onDoubleClick: () => setDialogOpen(true) }),
    [rootProps],
  );

  return (
    <>
      <ImageViewerDesignElement element={element} rootProps={mergedRootProps} />
      <PlaceholderImageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSelect={handleImageSelect}
      />
    </>
  );
};
