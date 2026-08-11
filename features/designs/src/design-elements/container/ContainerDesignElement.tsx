import { useRef } from 'react';
import {
  ContainerElement,
  PagePanelElement,
  createBackdropImageWrapperStyle,
  createContainerCssStyle,
  getBackgroundImageStyle,
  resolveContainerBackdrop,
} from '@minddrop/designs';
import { Fs } from '@minddrop/file-system';
import { useMeasuredImageWidth } from '@minddrop/utils';
import { DesignElement } from '../../DesignElements/DesignElement';
import { useElementProperty } from '../../DesignPropertiesProvider';
import { useElementPlaceholderImage } from '../../useElementPlaceholder';
import { useMediaFilePath } from '../../useMediaFilePath';
import { getRegionFlexStyle } from '../../utils';

export interface ContainerDesignElementProps {
  /**
   * The container element to render. Page panels reuse this
   * renderer since they are structurally containers.
   */
  element: ContainerElement | PagePanelElement;
}

/**
 * Display renderer for a container design element.
 * Renders a div with container styles and recursively
 * renders child elements. When mapped to an image property,
 * uses the property value as background image.
 */
export const ContainerDesignElement: React.FC<ContainerDesignElementProps> = ({
  element,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { style } = element;
  const property = useElementProperty(element.id);
  const placeholderImage = useElementPlaceholderImage(
    element,
    style.backgroundImage,
  );
  const placeholderImagePath = useMediaFilePath(placeholderImage);
  const { width, isMeasured } = useMeasuredImageWidth(containerRef);

  // Use the mapped property value (file path) as background image
  // if available, otherwise fall back to the placeholder image
  const imagePath =
    typeof property?.value === 'string' && property.value
      ? property.value
      : placeholderImagePath;

  const imageSrc = Fs.useImageSrc(imagePath, width);

  // Held back until measured so that the full resolution image is not
  // fetched before the requested width is known. Layout branches below
  // key off imageSrc instead, so that they do not change once measured.
  const paintedImageSrc = isMeasured ? imageSrc : null;

  const { hasBackdropWithImage, gradientOverlayStyle } =
    resolveContainerBackdrop(style, imageSrc);

  const baseContainerStyle = createContainerCssStyle(style);

  // Pre-merge background image into the container style. When backdrop
  // effects are active the image goes on a separate wrapper instead.
  const containerCssStyle = {
    ...baseContainerStyle,
    ...(!hasBackdropWithImage &&
      getBackgroundImageStyle(
        paintedImageSrc,
        baseContainerStyle.backgroundColor,
      )),
    // Panelled page root regions: panels stay fixed-width, content grows
    ...getRegionFlexStyle(element),
  };

  const children = element.children.map((child) => (
    <DesignElement key={child.id} element={child} />
  ));

  // When backdrop effects + bg image are both active, the background
  // image goes on an outer wrapper so backdrop-filter affects the image
  if (hasBackdropWithImage) {
    return (
      <div
        ref={containerRef}
        style={{
          ...createBackdropImageWrapperStyle(
            imageSrc!,
            containerCssStyle,
            gradientOverlayStyle,
          ),
          ...(!isMeasured && { backgroundImage: undefined }),
        }}
      >
        {gradientOverlayStyle && <div style={gradientOverlayStyle} />}
        <div style={containerCssStyle}>{children}</div>
      </div>
    );
  }

  // When gradient is active without a bg image, wrap in a
  // relative container for the absolutely positioned overlay
  if (gradientOverlayStyle) {
    return (
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          isolation: 'isolate',
          alignSelf: containerCssStyle.alignSelf,
        }}
      >
        <div style={gradientOverlayStyle} />
        <div style={containerCssStyle}>{children}</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={containerCssStyle}>
      {children}
    </div>
  );
};
