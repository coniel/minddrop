import { ImageElement, createImageCssStyle } from '@minddrop/designs';
import { Image } from '@minddrop/ui-components';
import { Icon } from '@minddrop/ui-primitives';
import { useElementProperty } from '../../DesignPropertiesProvider';
import { useElementPlaceholderImage } from '../../useElementPlaceholder';
import { useMediaFilePath } from '../../useMediaFilePath';

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
  const property = useElementProperty(element.id);
  const placeholderImage = useElementPlaceholderImage(element, element.content);
  const placeholderImagePath = useMediaFilePath(placeholderImage);
  const cssStyle = createImageCssStyle(element.style);
  const rootStyle = rootProps?.style as React.CSSProperties | undefined;

  // Use the bound property value (file path) if available,
  // otherwise fall back to the placeholder image
  const imagePath =
    typeof property?.value === 'string' && property.value
      ? property.value
      : placeholderImagePath;

  // Render the image.
  // For "contain", strip width/height so the img sizes naturally
  // to its aspect ratio constrained by max-width/max-height.
  // This makes the element box match the visible image so
  // border-radius clips correctly (object-fit: contain would
  // otherwise letterbox inside an oversized element box).
  if (imagePath) {
    const isContain = element.style.objectFit === 'contain';

    return (
      <Image
        {...rootProps}
        path={imagePath}
        className={rootProps?.className as string | undefined}
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
