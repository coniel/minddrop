import { ImagePropertyElement } from '@minddrop/designs';
import { Fs } from '@minddrop/file-system';
import { ImageViewer } from '@minddrop/ui-components';
import { Icon } from '@minddrop/ui-primitives';
import { Theme } from '@minddrop/ui-theme';
import { useDesignPreview } from '../../DesignElements';
import { useElementProperty } from '../../DesignPropertiesProvider';
import { useElementCssStyle } from '../../useElementCssStyle';
import { useElementPlaceholderImage } from '../../useElementPlaceholder';
import { useMediaFilePath } from '../../useMediaFilePath';
import '../elementPlaceholder.css';

export interface ImageViewerPropertyRendererProps {
  /**
   * The image property element to render.
   */
  element: ImagePropertyElement;
}

/**
 * Display renderer for an image property element rendered as a
 * viewer. Resolves the image source from the bound property or
 * placeholder, then delegates to the generic ImageViewer component
 * for zoom/pan interaction.
 */
export const ImageViewerPropertyRenderer: React.FC<
  ImageViewerPropertyRendererProps
> = ({ element }) => {
  const preview = useDesignPreview();
  const property = useElementProperty(element.id);
  const placeholderImage = useElementPlaceholderImage(element);
  const placeholderImagePath = useMediaFilePath(placeholderImage);
  const containerStyle = useElementCssStyle(element);

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
        className="designs-element-placeholder"
        style={{
          ...containerStyle,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-2)',
          aspectRatio: '16 / 9',
        }}
      >
        <Icon name="scan" size={24} style={{ flexShrink: 0 }} />
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
        visibility: treatmentVisibility,
      }}
      preview={preview}
    />
  );
};
