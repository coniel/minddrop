import { useCallback, useMemo } from 'react';
import {
  createBackdropImageWrapperStyle,
  createElementCssStyle,
  getBackgroundImageStyle,
  getPlaceholderMediaDirPath,
  resolveContainerBackdrop,
} from '@minddrop/designs';
import { Fs } from '@minddrop/file-system';
import { DropEventData } from '@minddrop/selection';
import { FlexDropContainer } from '@minddrop/ui-drag-and-drop';
import { DesignStudioElement } from '../DesignStudioElement/DesignStudioElement';
import { DesignStudioStore } from '../DesignStudioStore';
import { useLayoutId } from '../LayoutIdContext';
import { handleDropOnGap } from '../handleDropOnGap';
import { FlatRootDesignElement } from '../types';
import { useElementPlaceholderImage } from '../useElementPlaceholder';
import './DesignStudioRootElement.css';

export interface DesignStudioRootElementProps {
  element: FlatRootDesignElement;
}

export const DesignStudioRootElement: React.FC<
  DesignStudioRootElementProps
> = ({ element }) => {
  const { style } = element;
  const layoutId = useLayoutId();

  // Resolve the background image from the bound image property's
  // placeholder, falling back to the static background image
  const backgroundImage = useElementPlaceholderImage(
    element,
    style.backgroundImage,
  );

  // Resolve background image path if set
  const imagePath = useMemo(
    () =>
      backgroundImage
        ? Fs.concatPath(getPlaceholderMediaDirPath(), backgroundImage)
        : null,
    [backgroundImage],
  );

  const imageSrc = Fs.useImageSrc(imagePath);

  const { hasBackdropWithImage, gradientOverlayStyle } =
    resolveContainerBackdrop(style, imageSrc);

  // Select the root element when clicking the root background,
  // activating the containing layout. Only fires when the click
  // target is inside this element, ignoring clicks from dialog
  // overlays closing.
  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      const rootElement = event.currentTarget as HTMLElement;

      if (!rootElement.contains(event.target as Node)) {
        return;
      }

      DesignStudioStore.getState().selectElement('root', layoutId ?? undefined);
    },
    [layoutId],
  );

  // Route drops on the root's gaps into this frame's layout,
  // regardless of which layout is active
  const handleDrop = useCallback(
    (drop: DropEventData, containerId: string, gapIndex: number) => {
      handleDropOnGap(drop, containerId, gapIndex, layoutId ?? undefined);
    },
    [layoutId],
  );

  const baseContainerStyle = createElementCssStyle(element);

  // Pre-merge background image into the container style. When backdrop
  // effects are active the image goes on a separate wrapper instead.
  const containerCssStyle = {
    ...baseContainerStyle,
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
      onDrop={handleDrop}
    >
      {children}
    </FlexDropContainer>
  );

  const fillStyle = { width: '100%' as const, height: '100%' as const };

  return (
    <div onClick={handleClick} data-element-id="root" style={fillStyle}>
      {hasBackdropWithImage ? (
        <div
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
          {flexDropContainer}
        </div>
      ) : gradientOverlayStyle ? (
        <div
          style={{
            ...fillStyle,
            position: 'relative',
            isolation: 'isolate',
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
