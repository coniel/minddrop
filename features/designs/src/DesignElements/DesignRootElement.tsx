import { useMemo } from 'react';
import {
  RootElement,
  createBackdropImageWrapperStyle,
  createElementCssStyle,
  getBackgroundImageStyle,
  getPlaceholderMediaDirPath,
  resolveContainerBackdrop,
} from '@minddrop/designs';
import { Fs } from '@minddrop/file-system';
import { useElementProperty } from '../DesignPropertiesProvider';
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
  const { style } = element;
  const property = useElementProperty(element.id);

  // Use the mapped property value (file path) as background image
  // if available, otherwise resolve the placeholder from the design media dir
  const imagePath = useMemo(() => {
    if (property?.value && typeof property.value === 'string') {
      return property.value;
    }

    if (style.backgroundImage) {
      return Fs.concatPath(getPlaceholderMediaDirPath(), style.backgroundImage);
    }

    return null;
  }, [property?.value, style.backgroundImage]);

  const imageSrc = Fs.useImageSrc(imagePath);

  const { hasBackdropWithImage, gradientOverlayStyle } =
    resolveContainerBackdrop(style, imageSrc);

  const baseContainerStyle = createElementCssStyle(element);

  // Pre-merge background image into the container style. When backdrop
  // effects are active the image goes on a separate wrapper instead.
  const containerCssStyle = {
    ...baseContainerStyle,
    ...(!hasBackdropWithImage &&
      getBackgroundImageStyle(imageSrc, baseContainerStyle.backgroundColor)),
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
        className={className}
        data-element-id={element.id}
        style={{
          ...fillStyle,
          ...createBackdropImageWrapperStyle(
            imageSrc!,
            containerCssStyle,
            gradientOverlayStyle,
          ),
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
      className={className}
      data-element-id={element.id}
      style={{ ...containerCssStyle, ...fillStyle }}
    >
      {children}
    </div>
  );
};
