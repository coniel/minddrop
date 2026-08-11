import { useMemo, useRef } from 'react';
import {
  ImageElement,
  createImageCssStyle,
  getPlaceholderMediaDirPath,
} from '@minddrop/designs';
import { Fs } from '@minddrop/file-system';
import { Icon } from '@minddrop/ui-primitives';
import { useMeasuredImageWidth } from '@minddrop/utils';
import { useElementProperty } from '../../DesignPropertiesProvider';
import { useElementPlaceholderImage } from '../../useElementPlaceholder';

export interface ImageDesignElementProps {
  /**
   * The image element to render.
   */
  element: ImageElement;

  /**
   * Optional props to spread on the root DOM element.
   */
  rootProps?: Record<string, unknown>;
}

/**
 * Display renderer for an image design element.
 * Shows the mapped property image when available,
 * otherwise falls back to the placeholder image or
 * a placeholder div with an image icon.
 */
export const ImageDesignElement: React.FC<ImageDesignElementProps> = ({
  element,
  rootProps,
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const property = useElementProperty(element.id);
  const placeholderImage = useElementPlaceholderImage(element, element.content);
  const { width, isMeasured } = useMeasuredImageWidth(imageRef);
  const cssStyle = createImageCssStyle(element.style);
  const rootStyle = rootProps?.style as React.CSSProperties | undefined;

  // Use the bound property value (file path) if available,
  // otherwise resolve the placeholder image from the media dir
  const imagePath = useMemo(() => {
    if (property?.value && typeof property.value === 'string') {
      return property.value;
    }

    if (placeholderImage) {
      return Fs.concatPath(getPlaceholderMediaDirPath(), placeholderImage);
    }

    return null;
  }, [property?.value, placeholderImage]);

  const imageSrc = Fs.useImageSrc(imagePath, width);

  // Render the image.
  // For "contain", strip width/height so the img sizes naturally
  // to its aspect ratio constrained by max-width/max-height.
  // This makes the element box match the visible image so
  // border-radius clips correctly (object-fit: contain would
  // otherwise letterbox inside an oversized element box).
  if (imageSrc) {
    const isContain = element.style.objectFit === 'contain';

    return (
      <img
        {...rootProps}
        ref={imageRef}
        // Held back until measured so that the full resolution image
        // is not fetched before the requested width is known
        src={isMeasured ? imageSrc : undefined}
        alt=""
        style={{
          ...cssStyle,
          ...(isContain && { width: undefined, height: undefined }),
          maxWidth: '100%',
          maxHeight: '100%',
          display: 'block',
          ...(!isContain && {
            minHeight: cssStyle.height,
            minWidth: cssStyle.width,
          }),
          ...rootStyle,
        }}
      />
    );
  }

  // No image set - show placeholder with icon
  return (
    <div
      {...rootProps}
      style={{
        ...cssStyle,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        aspectRatio: '16 / 9',
        backgroundColor: 'var(--neutral-400)',
        ...rootStyle,
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
