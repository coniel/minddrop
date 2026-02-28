import { useMemo } from 'react';
import {
  ImageElement,
  createImageCssStyle,
  getPlaceholderMediaDirPath,
} from '@minddrop/designs';
import { Fs } from '@minddrop/file-system';
import { Icon } from '@minddrop/ui-primitives';

export interface DesignImageElementProps {
  /**
   * The image element to render.
   */
  element: ImageElement;
}

/**
 * Pure display renderer for an image design element.
 * Renders the placeholder image if set, otherwise shows
 * a placeholder div with an image icon.
 */
export const DesignImageElement: React.FC<DesignImageElementProps> = ({
  element,
}) => {
  const cssStyle = createImageCssStyle(element.style);

  // Resolve full path to the placeholder image file
  const imagePath = useMemo(
    () =>
      element.placeholderImage
        ? Fs.concatPath(getPlaceholderMediaDirPath(), element.placeholderImage)
        : null,
    [element.placeholderImage],
  );

  const imageSrc = Fs.useImageSrc(imagePath);

  // Render the placeholder image
  if (imageSrc) {
    return (
      <img
        src={imageSrc}
        alt=""
        style={{
          ...cssStyle,
          maxWidth: '100%',
          display: 'block',
          minHeight: cssStyle.height || 80,
          minWidth: 80,
        }}
      />
    );
  }

  // No image set — show placeholder with icon
  return (
    <div
      style={{
        ...cssStyle,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        aspectRatio: '16 / 9',
        backgroundColor: 'var(--neutral-400)',
      }}
    >
      <Icon
        name="image"
        size={24}
        style={{ color: 'var(--contrast-500)', flexShrink: 0 }}
      />
    </div>
  );
};
