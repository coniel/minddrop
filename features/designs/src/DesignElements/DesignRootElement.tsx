import { useRef } from 'react';
import {
  RootElement,
  createBackdropImageWrapperStyle,
  createElementCssStyle,
  resolveBackgroundImageStyle,
  resolveContainerBackdrop,
} from '@minddrop/designs';
import { Fs } from '@minddrop/file-system';
import { useMeasuredImageWidth } from '@minddrop/utils';
import { useElementProperty } from '../DesignPropertiesProvider';
import { useElementPlaceholderImage } from '../useElementPlaceholder';
import { useMediaFilePath } from '../useMediaFilePath';
import { DesignElement } from './DesignElement';

export interface DesignRootElementProps {
  /**
   * The root element to render.
   */
  element: RootElement;

  /**
   * Optional CSS class name applied to the outermost div.
   */
  className?: string;
}

/**
 * Display renderer for the root design element.
 * Renders a div with root styles and recursively
 * renders child elements. When mapped to an image property,
 * uses the property value as background image.
 */
export const DesignRootElement: React.FC<DesignRootElementProps> = ({
  element,
  className,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { style } = element;
  const property = useElementProperty(element.id);
  const placeholderImage = useElementPlaceholderImage(
    element,
    style.backgroundImage,
  );
  const placeholderImagePath = useMediaFilePath(placeholderImage);
  const { width, isMeasured } = useMeasuredImageWidth(rootRef);

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

  const baseContainerStyle = createElementCssStyle(element);

  // Pre-merge background image into the container style. When backdrop
  // effects are active the image goes on a separate wrapper instead.
  const containerCssStyle = {
    ...baseContainerStyle,
    ...(!hasBackdropWithImage &&
      resolveBackgroundImageStyle(
        paintedImageSrc,
        baseContainerStyle.backgroundColor,
      )),
  };

  const children = element.children.map((child) => (
    <DesignElement key={child.id} element={child} />
  ));

  // Shared sizing so the root element fills the canvas content area
  const fillStyle = { width: '100%' as const, height: '100%' as const };

  // When backdrop effects + bg image are both active, the background
  // image goes on an outer wrapper so backdrop-filter affects the image
  if (hasBackdropWithImage) {
    return (
      <div
        ref={rootRef}
        className={className}
        data-element-id={element.id}
        style={{
          ...fillStyle,
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
        ref={rootRef}
        className={className}
        data-element-id={element.id}
        style={{
          ...fillStyle,
          position: 'relative',
          isolation: 'isolate',
        }}
      >
        <div style={gradientOverlayStyle} />
        <div style={containerCssStyle}>{children}</div>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={className}
      data-element-id={element.id}
      style={{ ...containerCssStyle, ...fillStyle }}
    >
      {children}
    </div>
  );
};
