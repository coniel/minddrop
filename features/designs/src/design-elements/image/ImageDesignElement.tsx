import { useMemo } from 'react';
import {
  ImageElement,
  createImageCssStyle,
  getPlaceholderMediaDirPath,
} from '@minddrop/designs';
import { Fs } from '@minddrop/file-system';
import { Icon } from '@minddrop/ui-primitives';
import { useElementProperty } from '../../DesignPropertiesProvider';

export interface ImageDesignElementProps {
  /**
   * The image element to render.
   */
  element: ImageElement;
}

/**
 * Display renderer for an image design element.
 * Shows the mapped property image when available,
 * otherwise falls back to the placeholder image or
 * a placeholder div with an image icon.
 */
export const ImageDesignElement: React.FC<ImageDesignElementProps> = ({
  element,
}) => {
  const property = useElementProperty(element.id);
  const cssStyle = createImageCssStyle(element.style);

  // Use the mapped property value (file path) if available,
  // otherwise resolve the placeholder image from the design media dir
  const imagePath = useMemo(() => {
    if (property?.value && typeof property.value === 'string') {
      return property.value;
    }

    if (element.placeholderImage) {
      return Fs.concatPath(
        getPlaceholderMediaDirPath(),
        element.placeholderImage,
      );
    }

    return null;
  }, [property?.value, element.placeholderImage]);

  const imageSrc = Fs.useImageSrc(imagePath);

  // Render the image
  if (imageSrc) {
    return (
      <img
        src={imageSrc}
        alt=""
        style={{
          ...cssStyle,
          maxWidth: '100%',
          maxHeight: '100%',
          display: 'block',
          minHeight: cssStyle.height,
          minWidth: cssStyle.width,
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
