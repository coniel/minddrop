import { useMemo } from 'react';
import {
  RootElement,
  createElementCssStyle,
  getPlaceholderMediaDirPath,
} from '@minddrop/designs';
import { Fs } from '@minddrop/file-system';
import { DesignElement } from './DesignElement';

export interface DesignRootElementProps {
  /**
   * The root element to render.
   */
  element: RootElement;
}

/**
 * Pure display renderer for the root design element.
 * Renders a div with root styles and recursively
 * renders child elements.
 */
export const DesignRootElement: React.FC<DesignRootElementProps> = ({
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

  return (
    <div
      style={{
        ...createElementCssStyle(element),
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
