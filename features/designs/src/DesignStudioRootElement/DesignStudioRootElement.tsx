import { useCallback, useMemo } from 'react';
import {
  createBackdropGradientOverlayStyle,
  createElementCssStyle,
  getBackgroundImageStyle,
  getPlaceholderMediaDirPath,
} from '@minddrop/designs';
import { Fs } from '@minddrop/file-system';
import { FlexDropContainer } from '@minddrop/ui-drag-and-drop';
import { DesignStudioElement } from '../DesignStudioElement/DesignStudioElement';
import { DesignStudioStore } from '../DesignStudioStore';
import { handleDropOnGap } from '../handleDropOnGap';
import { FlatRootDesignElement } from '../types';
import './DesignStudioRootElement.css';

export interface DesignStudioRootElementProps {
  element: FlatRootDesignElement;
}

export const DesignStudioRootElement: React.FC<
  DesignStudioRootElementProps
> = ({ element }) => {
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

  // Gradient overlay style (null when gradient is not active)
  const gradientOverlayStyle = createBackdropGradientOverlayStyle(style);

  // Select the root element when clicking the root background.
  // Only fires when the click target is inside this element,
  // ignoring clicks from dialog overlays closing.
  const handleClick = useCallback((event: React.MouseEvent) => {
    const rootElement = event.currentTarget as HTMLElement;

    if (!rootElement.contains(event.target as Node)) {
      return;
    }

    DesignStudioStore.getState().selectElement('root');
  }, []);

  const baseContainerStyle = createElementCssStyle(element);

  const containerCssStyle = {
    ...baseContainerStyle,
    // Apply background image URL (only when backdrop effects are not active).
    // When a background color is also set, layer it as a gradient on top
    // of the image so it overlays rather than sitting behind it.
    ...(!hasBackdropWithImage &&
      getBackgroundImageStyle(imageSrc, baseContainerStyle.backgroundColor)),
  };

  const children = element.children.map((childId, index) => (
    <DesignStudioElement
      key={childId}
      elementId={childId}
      index={index}
      isLastChild={index === element.children.length - 1}
    />
  ));

  const flexDropContainer = (
    <FlexDropContainer
      key={style.direction}
      id="root"
      gap={style.gap}
      direction={style.direction}
      align={style.alignItems}
      justify={style.justifyContent}
      className="design-studio-root-element"
      style={containerCssStyle}
      onDrop={handleDropOnGap}
    >
      {children}
    </FlexDropContainer>
  );

  return (
    <div
      onClick={handleClick}
      data-element-id="root"
      style={{ width: '100%', height: '100%' }}
    >
      {hasBackdropWithImage ? (
        <div
          style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: containerCssStyle.backgroundSize,
            backgroundPosition: containerCssStyle.backgroundPosition,
            backgroundRepeat: containerCssStyle.backgroundRepeat,
            borderRadius: containerCssStyle.borderRadius,
            overflow: 'hidden',
            width: '100%',
            height: '100%',
            // Create stacking context for gradient overlay
            ...(gradientOverlayStyle && {
              position: 'relative' as const,
              isolation: 'isolate' as const,
            }),
          }}
        >
          {gradientOverlayStyle && <div style={gradientOverlayStyle} />}
          {flexDropContainer}
        </div>
      ) : gradientOverlayStyle ? (
        <div
          style={{
            position: 'relative',
            isolation: 'isolate',
            width: '100%',
            height: '100%',
          }}
        >
          <div style={gradientOverlayStyle} />
          {flexDropContainer}
        </div>
      ) : (
        flexDropContainer
      )}
    </div>
  );
};
