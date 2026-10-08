import { DesignElementProps } from '@minddrop/designs-next';
import { Fs } from '@minddrop/file-system';
import { ImageViewer } from '@minddrop/ui-components';
import { useElementFilePath } from '@minddrop/ui-designs-next';
import { Group, Icon } from '@minddrop/ui-primitives';
import { Theme } from '@minddrop/ui-theme';
import { ImageViewerElement } from '../ImageViewerElement.types';
import './ImageViewerElementRenderer.css';

/**
 * Renders an image viewer element as the picture of the image
 * property it maps to, zoomed and panned.
 */
export const ImageViewerElementRenderer: React.FC<
  DesignElementProps<ImageViewerElement>
> = ({ element }) => {
  // Read the path of the picture the element maps to
  const path = useElementFilePath(element);
  // Resolve the picture's src
  const src = Fs.useImageSrc(path);
  // Read the picture's stats
  const stats = Fs.useImageStats(path);
  // Read the theme's treatment of the picture
  const { className: treatmentClassName, pending: treatmentPending } =
    Theme.useImageTreatment(path);

  // Render the placeholder when the element has no picture
  if (!src) {
    return (
      <Group
        className="design-image-viewer-element design-image-viewer-element-placeholder"
        justify="center"
      >
        <Icon name="scan-search" />
      </Group>
    );
  }

  // Build the picture's natural size from its stats, if known
  const naturalSize =
    stats?.width && stats.height
      ? { width: stats.width, height: stats.height }
      : null;

  // Hide the viewer until the treatment is classified, so the
  // picture does not flash untreated.
  const className = treatmentPending
    ? 'design-image-viewer-element design-image-viewer-element-pending'
    : 'design-image-viewer-element';

  return (
    <ImageViewer
      className={className}
      imageClassName={treatmentClassName}
      src={src}
      naturalSize={naturalSize}
    />
  );
};
