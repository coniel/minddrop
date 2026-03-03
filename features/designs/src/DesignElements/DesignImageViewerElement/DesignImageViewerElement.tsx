import { useMemo } from 'react';
import {
  ImageViewerElement,
  createImageViewerCssStyle,
  getPlaceholderMediaDirPath,
} from '@minddrop/designs';
import { Fs } from '@minddrop/file-system';
import { ImageViewer } from '@minddrop/ui-components';
import { Icon } from '@minddrop/ui-primitives';
import { useElementProperty } from '../../DesignPropertiesProvider';
import { useDesignPreview } from '../DesignPreviewContext';

export interface DesignImageViewerElementProps {
  /**
   * The image viewer element to render.
   */
  element: ImageViewerElement;
}

/**
 * Display renderer for an image viewer design element.
 * Resolves the image source from the mapped property or
 * placeholder, then delegates to the generic ImageViewer
 * component for zoom/pan interaction.
 */
export const DesignImageViewerElement: React.FC<
  DesignImageViewerElementProps
> = ({ element }) => {
  const preview = useDesignPreview();
  const property = useElementProperty(element.id);
  const containerStyle = createImageViewerCssStyle(element.style);

  // When no explicit height is configured, grow to fill the
  // parent flex container
  if (!element.style.height) {
    containerStyle.flex = 1;
  }

  // Resolve the image path from mapped property or placeholder
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

  // No image set — show placeholder with icon
  if (!imageSrc) {
    return (
      <div
        style={{
          ...containerStyle,
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
          name="scan"
          size={24}
          style={{ color: 'var(--contrast-500)', flexShrink: 0 }}
        />
      </div>
    );
  }

  return (
    <ImageViewer src={imageSrc} style={containerStyle} preview={preview} />
  );
};
