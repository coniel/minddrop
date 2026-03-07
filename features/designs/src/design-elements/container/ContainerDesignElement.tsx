import { useMemo } from 'react';
import {
  ContainerElement,
  createBackdropImageWrapperStyle,
  createContainerCssStyle,
  getBackgroundImageStyle,
  getPlaceholderMediaDirPath,
  resolveContainerBackdrop,
} from '@minddrop/designs';
import { Fs } from '@minddrop/file-system';
import { DesignElement } from '../../DesignElements/DesignElement';
import { useElementProperty } from '../../DesignPropertiesProvider';

export interface ContainerDesignElementProps {
  /**
   * The container element to render.
   */
  element: ContainerElement;
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

  const baseContainerStyle = createContainerCssStyle(style);

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

  // When backdrop effects + bg image are both active, the background
  // image goes on an outer wrapper so backdrop-filter affects the image
  if (hasBackdropWithImage) {
    return (
      <div
        style={createBackdropImageWrapperStyle(
          imageSrc!,
          containerCssStyle,
          gradientOverlayStyle,
        )}
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

  return <div style={containerCssStyle}>{children}</div>;
};
