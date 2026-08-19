import {
  ImageElement,
  ImageStyle,
  resolveElementStyle,
} from '@minddrop/designs';
import { Image } from '@minddrop/ui-components';
import { Icon } from '@minddrop/ui-primitives';
import { useElementProperty } from '../../DesignPropertiesProvider';
import { useLayoutType } from '../../LayoutTypeContext';
import { useElementCssStyle } from '../../useElementCssStyle';
import { useElementPlaceholderImage } from '../../useElementPlaceholder';
import { useMediaFilePath } from '../../useMediaFilePath';
import '../elementPlaceholder.css';

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
  const placeholderImage = useElementPlaceholderImage(element, element.content);
  const placeholderImagePath = useMediaFilePath(placeholderImage);
  // The surrounding layout's type, which role styles resolve against
  const layoutType = useLayoutType();
  // Resolve the element's style with its role styles applied
  const style: ImageStyle = resolveElementStyle(
    element,
    layoutType ?? undefined,
  );
  const cssStyle = useElementCssStyle(element);

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
    const isContain = style.objectFit === 'contain';

    return (
      <Image
        path={imagePath}
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
        }}
      />
    );
  }

  // No image set - show placeholder with icon
  return (
    <div
      className="designs-element-placeholder"
      style={{
        ...cssStyle,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        aspectRatio: '16 / 9',
      }}
    >
      <Icon name="image" size={24} style={{ flexShrink: 0 }} />
    </div>
  );
};
