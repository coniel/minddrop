import React, { CSSProperties, useCallback, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Designs,
  ImageElement,
  getPlaceholderMediaDirPath,
} from '@minddrop/designs';
import { Fs } from '@minddrop/file-system';
import { FilePropertySupportedFileExtensions } from '@minddrop/properties';
import { Selection } from '@minddrop/selection';
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
 * Uses a portaled overlay to intercept native WebKit image
 * drag (which conflicts with HTML5 DnD). The overlay only
 * handles drag initiation and clicks; the img itself handles
 * drop events so it participates in the FlexDropContainer
 * normally. During active drags the overlay gets
 * pointer-events:none so it does not block drop targets.
 */
export const ImageStudioDesignElement: React.FC<
  ImageStudioDesignElementProps
> = ({ element, rootProps }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const isDragging = Selection.useIsDragging();

  // Track whether this image initiated the current drag
  const [isSelfDragging, setIsSelfDragging] = useState(false);

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

  // Opens the dialog if existing images exist, otherwise opens the file picker.
  // Clears the drag overlay so it does not cover the dialog.
  const handleDoubleClick = useCallback(async () => {
    setOverlayRect(null);

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

  // Show the drag overlay when the mouse enters the img
  const handleMouseEnter = useCallback((event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setOverlayRect(rect);
  }, []);

  // Hide the overlay when the mouse leaves it
  const handleOverlayMouseLeave = useCallback(() => {
    setOverlayRect(null);
  }, []);

  // Hide the overlay on any wheel event so it does not
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

  // Split rootProps into drag-initiation props (for the overlay)
  // and drop/identification props (for the img)
  const {
    draggable,
    onDragStart: originalOnDragStart,
    onDragEnd: originalOnDragEnd,
    onClick,
    style: rootStyle,
    ...imgDropProps
  } = rootProps as {
    draggable?: boolean;
    onDragStart?: (event: React.DragEvent) => void;
    onDragEnd?: (event: React.DragEvent) => void;
    onClick?: (event: React.MouseEvent) => void;
    style?: CSSProperties;
    [key: string]: unknown;
  };

  const elementId = imgDropProps['data-element-id'] as string;

  // Override onDragStart to use the actual img element as the
  // drag ghost instead of the invisible overlay div
  const handleDragStart = useCallback(
    (event: React.DragEvent) => {
      setIsSelfDragging(true);

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

  // Props for the img: drop handlers, ref, data-element-id,
  // click, mouseEnter, and visual style
  const imgRootProps = useMemo(
    () => ({
      ...imgDropProps,
      onClick,
      onMouseEnter: handleMouseEnter,
      style: rootStyle,
    }),
    [imgDropProps, onClick, handleMouseEnter, rootStyle],
  );

  return (
    <>
      <ImageDesignElement element={element} rootProps={imgRootProps} />
      {overlayRect &&
        createPortal(
          <div
            draggable={draggable}
            onDragStart={handleDragStart}
            onDragEnd={(event: React.DragEvent) => {
              setIsSelfDragging(false);
              originalOnDragEnd?.(event);
            }}
            onClick={onClick}
            onDragOver={(event: React.DragEvent) => {
              event.preventDefault();
            }}
            onDrop={(event: React.DragEvent) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onDoubleClick={handleDoubleClick}
            onMouseLeave={handleOverlayMouseLeave}
            style={{
              position: 'fixed',
              top: overlayRect.top,
              left: overlayRect.left,
              width: overlayRect.width,
              height: overlayRect.height,
              zIndex: 9999,
              background: 'transparent',
              // During active drags, let events pass through to
              // the img below so it can act as a drop target
              // within the FlexDropContainer
              ...(isDragging && !isSelfDragging && { pointerEvents: 'none' }),
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
