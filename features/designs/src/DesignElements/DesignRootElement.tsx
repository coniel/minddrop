import { useMemo } from 'react';
import {
  RootElement,
  createBackdropGradientOverlayStyle,
  createElementCssStyle,
  getPlaceholderMediaDirPath,
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

  // Whether any backdrop effects are active (blur or brightness)
  const hasBackdropEffects =
    style.backdropBlur > 0 || style.backdropBrightness !== 100;

  // Whether to use a nested div (bg image on outer, effects on inner)
  const hasBackdropWithImage = hasBackdropEffects && !!imageSrc;

  // Gradient overlay style (null when gradient is not active)
  const gradientOverlayStyle = createBackdropGradientOverlayStyle(style);

  const containerCssStyle = createElementCssStyle(element);

  const children = element.children.map((child) => (
    <DesignElement key={child.id} element={child} />
  ));

  // When backdrop effects + bg image are both active, the background
  // image goes on an outer wrapper so backdrop-filter affects the image
  if (hasBackdropWithImage) {
    return (
      <div
        className={className}
        data-element-id={element.id}
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: containerCssStyle.backgroundSize,
          backgroundPosition: containerCssStyle.backgroundPosition,
          backgroundRepeat: containerCssStyle.backgroundRepeat,
          borderRadius: containerCssStyle.borderRadius,
          overflow: 'hidden',
          // Create stacking context for gradient overlay
          ...(gradientOverlayStyle && {
            position: 'relative' as const,
            isolation: 'isolate' as const,
          }),
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
        style={{ position: 'relative', isolation: 'isolate' }}
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
      style={{
        ...containerCssStyle,
        // Apply background image URL resolved from the file system
        ...(imageSrc && { backgroundImage: `url(${imageSrc})` }),
      }}
    >
      {children}
    </div>
  );
};
