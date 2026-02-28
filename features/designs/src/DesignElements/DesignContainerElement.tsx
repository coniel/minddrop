import { useMemo } from 'react';
import {
  ContainerElement,
  createContainerCssStyle,
  getPlaceholderMediaDirPath,
} from '@minddrop/designs';
import { Fs } from '@minddrop/file-system';
import { DesignElement } from './DesignElement';

export interface DesignContainerElementProps {
  /**
   * The container element to render.
   */
  element: ContainerElement;
}

/**
 * Pure display renderer for a container design element.
 * Renders a div with container styles and recursively
 * renders child elements.
 */
export const DesignContainerElement: React.FC<DesignContainerElementProps> = ({
  element,
}) => {
  const { style } = element;

  // Resolve background image path if set
  const imagePath = useMemo(
    () =>
      style.backgroundImage
        ? Fs.concatPath(getPlaceholderMediaDirPath(), style.backgroundImage)
        : null,
    [style.backgroundImage],
  );

  const imageSrc = Fs.useImageSrc(imagePath);

  // Whether any backdrop effects are active (blur or brightness)
  const hasBackdropEffects =
    style.backdropBlur > 0 || style.backdropBrightness !== 100;

  // Whether to use a nested div (bg image on outer, effects on inner)
  const hasBackdropWithImage = hasBackdropEffects && !!imageSrc;

  const containerCssStyle = createContainerCssStyle(style);

  // When backdrop effects + bg image are both active, the background
  // image goes on an outer wrapper so backdrop-filter affects the image
  if (hasBackdropWithImage) {
    return (
      <div
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: containerCssStyle.backgroundSize,
          backgroundPosition: containerCssStyle.backgroundPosition,
          backgroundRepeat: containerCssStyle.backgroundRepeat,
          borderRadius: containerCssStyle.borderRadius,
          overflow: 'hidden',
        }}
      >
        <div style={containerCssStyle}>
          {element.children.map((child) => (
            <DesignElement key={child.id} element={child} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        ...containerCssStyle,
        // Apply background image URL resolved from the file system
        ...(imageSrc && { backgroundImage: `url(${imageSrc})` }),
      }}
    >
      {element.children.map((child) => (
        <DesignElement key={child.id} element={child} />
      ))}
    </div>
  );
};
