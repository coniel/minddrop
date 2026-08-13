import React from 'react';
import {
  ImageViewerElement,
  createImageViewerCssStyle,
} from '@minddrop/designs-legacy';
import { Fs } from '@minddrop/file-system';
import { ImageViewer } from '@minddrop/ui-components';
import { Icon } from '@minddrop/ui-primitives';
import { Theme } from '@minddrop/ui-theme';
import { useDesignPreview } from '../../DesignElements/DesignPreviewContext';
import { useElementProperty } from '../../DesignPropertiesProvider';
import { useElementPlaceholderImage } from '../../useElementPlaceholder';
import { useMediaFilePath } from '../../useMediaFilePath';

export interface ImageViewerDesignElementProps {
  /**
   * The image viewer element to render.
   */
  element: ImageViewerElement;

  /**
   * Optional props to spread on the root DOM element.
   */
  rootProps?: Record<string, unknown>;
}

/**
 * Display renderer for an image viewer design element.
 * Resolves the image source from the mapped property or
 * placeholder, then delegates to the generic ImageViewer
 * component for zoom/pan interaction.
 */
export const ImageViewerDesignElement: React.FC<
  ImageViewerDesignElementProps
> = ({ element, rootProps }) => {
  const preview = useDesignPreview();
  const property = useElementProperty(element.id);
  const placeholderImage = useElementPlaceholderImage(element, element.content);
  const placeholderImagePath = useMediaFilePath(placeholderImage);
  const containerStyle = createImageViewerCssStyle(element.style);
  const rootStyle = rootProps?.style as React.CSSProperties | undefined;

  // When no explicit height is configured, grow to fill the
  // parent flex container
  if (!element.style.height) {
    containerStyle.flex = 1;
  }

  // Resolve the image path from the bound property or placeholder
  const imagePath =
    typeof property?.value === 'string' && property.value
      ? property.value
      : placeholderImagePath;

  const imageSrc = Fs.useImageSrc(imagePath);
  const stats = Fs.useImageStats(imagePath);

  // Dark mode treatment applied by the theme to the image
  const { className: treatmentClassName, pending: treatmentPending } =
    Theme.useImageTreatment(imagePath);

  // Lets the viewer lay the image out and fill its space before the
  // full resolution image has arrived
  const naturalSize =
    stats?.width && stats.height
      ? { width: stats.width, height: stats.height }
      : null;

  // Kept hidden until classified so that the image does not flash
  // untreated. The viewer sizes and loads as usual behind it.
  const treatmentVisibility = treatmentPending ? 'hidden' : undefined;

  // No image set - show placeholder with icon
  if (!imageSrc) {
    return (
      <div
        {...rootProps}
        style={{
          ...containerStyle,
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
          name="scan"
          size={24}
          style={{ color: 'var(--contrast-500)', flexShrink: 0 }}
        />
      </div>
    );
  }

  // In studio mode (rootProps present), render a root div that
  // receives the drag/drop/click handlers and make the ImageViewer
  // non-interactive so events reach the root div
  if (rootProps) {
    return (
      <div {...rootProps} style={{ ...containerStyle, ...rootStyle }}>
        <ImageViewer
          src={imageSrc}
          imageClassName={treatmentClassName}
          naturalSize={naturalSize}
          placeholderColor={stats?.averageColor}
          style={{
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            visibility: treatmentVisibility,
          }}
          preview={false}
        />
      </div>
    );
  }

  return (
    <ImageViewer
      src={imageSrc}
      imageClassName={treatmentClassName}
      naturalSize={naturalSize}
      placeholderColor={stats?.averageColor}
      style={{
        ...containerStyle,
        ...rootStyle,
        visibility: treatmentVisibility,
      }}
      preview={preview}
    />
  );
};
