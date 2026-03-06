import React, { CSSProperties, useCallback, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Designs,
  ImageElement,
  getPlaceholderMediaDirPath,
} from '@minddrop/designs';
import { Fs } from '@minddrop/file-system';
import { FilePropertySupportedFileExtensions } from '@minddrop/properties';
import { updateDesignElement } from '../../DesignStudioStore';
import { PlaceholderImageDialog } from '../../style-editors/PlaceholderImageField/PlaceholderImageDialog';
import { FlatImageElement } from '../../types';
import { ImageDesignElement } from './ImageDesignElement';

export interface ImageStudioDesignElementProps {
  /**
   * The image element to render in the studio.
   */
  element: FlatImageElement;

  /**
   * Props to spread on the outermost DOM element for
   * drag-and-drop and click-to-select behaviour.
   */
  rootProps: Record<string, unknown>;
}

/**
 * Renders an image element in the design studio.
 * Wraps ImageDesignElement with interactive placeholder
 * image selection via double-click.
 */
export const ImageStudioDesignElement: React.FC<
  ImageStudioDesignElementProps
> = ({ element, rootProps }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  // Rect of the img element, set on mouseenter to position
  // the drag overlay. Null when overlay is not shown.
  const [overlayRect, setOverlayRect] = useState<DOMRect | null>(null);

  // Handles selecting an image from the dialog
  const handleImageSelect = useCallback(
    (fileName: string) => {
      updateDesignElement<ImageElement>(element.id, {
        placeholderImage: fileName,
      });
    },
    [element.id],
  );

  // Handles selecting a new image via the OS file picker
  const handleSelectNewImage = useCallback(async () => {
    const filePath = await Fs.openFilePicker({
      accept: FilePropertySupportedFileExtensions.image,
    });

    if (!filePath) {
      return;
    }

    const fileName = await Designs.addPlaceholderMedia(filePath as string);
    updateDesignElement<ImageElement>(element.id, {
      placeholderImage: fileName,
    });
  }, [element.id]);

  // Opens the dialog if existing images exist, otherwise opens the file picker
  const handleDoubleClick = useCallback(async () => {
    const dirPath = getPlaceholderMediaDirPath();
    const dirExists = await Fs.exists(dirPath);

    if (!dirExists) {
      handleSelectNewImage();

      return;
    }

    const entries = await Fs.readDir(dirPath);
    const imageExtensions = FilePropertySupportedFileExtensions.image;
    const hasImages = entries.some((entry) => {
      if (!entry.name) {
        return false;
      }

      const extension = entry.name.split('.').pop()?.toLowerCase();

      return extension && imageExtensions.includes(extension);
    });

    if (hasImages) {
      setDialogOpen(true);
    } else {
      handleSelectNewImage();
    }
  }, [handleSelectNewImage]);

  // Show the drag overlay when the mouse enters the img.
  // The overlay is a fixed-position transparent div that
  // intercepts drag events, avoiding native browser image
  // drag which conflicts with HTML5 DnD on WebKit.
  const handleMouseEnter = useCallback((event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setOverlayRect(rect);
  }, []);

  // Hide the overlay when the mouse leaves it
  const handleOverlayMouseLeave = useCallback(() => {
    setOverlayRect(null);
  }, []);

  // Hide the overlay on any wheel event so it doesn't
  // block scrolling or sit at a stale position
  React.useEffect(() => {
    if (!overlayRect) {
      return;
    }

    const hideOverlay = () => setOverlayRect(null);

    window.addEventListener('wheel', hideOverlay, { capture: true });

    return () => {
      window.removeEventListener('wheel', hideOverlay, { capture: true });
    };
  }, [overlayRect]);

  // Split rootProps: visual props go on the img, interactive
  // props go on the drag overlay
  const { style: rootStyle, ...rootPropsWithoutStyle } = rootProps as {
    style?: CSSProperties;
    [key: string]: unknown;
  };

  const elementId = rootPropsWithoutStyle['data-element-id'] as string;

  // Override onDragStart to use the actual img element as the
  // drag ghost instead of the invisible overlay div
  const originalOnDragStart = rootPropsWithoutStyle.onDragStart as (
    event: React.DragEvent,
  ) => void;

  const handleDragStart = useCallback(
    (event: React.DragEvent) => {
      // Let the original handler set up selection and data transfer
      originalOnDragStart?.(event);

      // Find the actual img element and use it as the drag image
      const imgElement = document.querySelector(
        `img[data-element-id="${elementId}"]`,
      ) as HTMLElement | null;

      if (imgElement) {
        const rect = imgElement.getBoundingClientRect();
        const clone = imgElement.cloneNode(true) as HTMLElement;

        clone.setAttribute(
          'style',
          `width: ${rect.width}px !important; height: ${rect.height}px !important; position: fixed; top: -9999px; left: -9999px;`,
        );
        document.body.appendChild(clone);

        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        event.dataTransfer.setDragImage(clone, offsetX, offsetY);

        requestAnimationFrame(() => {
          document.body.removeChild(clone);
        });
      }
    },
    [originalOnDragStart, elementId],
  );

  // Visual-only props for the img (no drag handlers)
  const imgRootProps = useMemo(
    () => ({
      'data-element-id': elementId,
      onMouseEnter: handleMouseEnter,
      style: rootStyle,
    }),
    [elementId, handleMouseEnter, rootStyle],
  );

  // Full interactive props for the overlay
  const overlayProps = useMemo(
    () => ({
      ...rootPropsWithoutStyle,
      onDragStart: handleDragStart,
      onDoubleClick: handleDoubleClick,
      onMouseLeave: handleOverlayMouseLeave,
    }),
    [
      rootPropsWithoutStyle,
      handleDragStart,
      handleDoubleClick,
      handleOverlayMouseLeave,
    ],
  );

  return (
    <>
      <ImageDesignElement element={element} rootProps={imgRootProps} />
      {overlayRect &&
        createPortal(
          <div
            {...overlayProps}
            style={{
              position: 'fixed',
              top: overlayRect.top,
              left: overlayRect.left,
              width: overlayRect.width,
              height: overlayRect.height,
              zIndex: 9999,
              background: 'transparent',
              ...rootStyle,
            }}
          />,
          document.body,
        )}
      <PlaceholderImageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSelect={handleImageSelect}
      />
    </>
  );
};
