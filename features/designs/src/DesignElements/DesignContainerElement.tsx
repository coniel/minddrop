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

  return (
    <div
      style={{
        ...createContainerCssStyle(style),
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
