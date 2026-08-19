import { CSSProperties, useCallback } from 'react';
import {
  RootStyle,
  createBackdropCss,
  resolveElementStyle,
} from '@minddrop/designs';
import { Fs } from '@minddrop/file-system';
import { DropEventData } from '@minddrop/selection';
import { FlexDropContainer } from '@minddrop/ui-drag-and-drop';
import { DesignStudioElement } from '../DesignStudioElement';
import { useDesignStudioPreview } from '../DesignStudioPreviewContext';
import { useDesignStudio, useDesignStudioStore } from '../DesignStudioStore';
import { EmptyDropHint } from '../EmptyDropHint';
import { useLayoutId } from '../LayoutIdContext';
import { useLayoutType } from '../LayoutTypeContext';
import { EmptyElementMinSize } from '../constants';
import { createStudioBackgroundImageCss } from '../design-elements/container/studioContainerCss';
import { handleDropOnGap } from '../handleDropOnGap';
import { FlatRootDesignElement } from '../types';
import { useElementPlaceholderImage } from '../useElementPlaceholder';
import { useMediaFilePath } from '../useMediaFilePath';
import { useSpaceTokenPixels } from '../useSpaceTokenPixels';
import './DesignStudioRootElement.css';
import { ParentDirectionProvider } from '../ParentDirectionContext';
import { useElementCssStyle } from '../useElementCssStyle';

export interface DesignStudioRootElementProps {
  element: FlatRootDesignElement;
}

/**
 * Renders a layout's root element in the design studio: a drop
 * container for free-form content, or a plain flex row when the
 * root is panelled. The wrapper owns the background image and
 * backdrop overlay so the container's drop machinery stays free
 * of overlay children.
 */
export const DesignStudioRootElement: React.FC<
  DesignStudioRootElementProps
> = ({ element }) => {
  const studio = useDesignStudio();
  const layoutId = useLayoutId();
  const { scheme: previewScheme } = useDesignStudioPreview();
  // The surrounding layout's type, falling back to the type
  // stamped on the root itself
  const layoutType = useLayoutType() ?? element.layoutType;
  // Resolve the root's style with its role styles applied
  const style: RootStyle = resolveElementStyle(element, layoutType);
  const isEmpty = element.children.length === 0;
  const gapPixels = useSpaceTokenPixels(style.gap);

  // Whether the root is panelled. A panelled root is not itself a
  // drop target: only its panels and content region accept drops,
  // so content can't be dropped between the regions.
  const panelled = useDesignStudioStore((state) => {
    const elements = layoutId ? state.elementsByLayout[layoutId] : undefined;

    if (!elements) {
      return false;
    }

    return element.children.some((childId) => {
      const child = elements[childId];

      if (!child) {
        return false;
      }

      if (child.type === 'page-panel') {
        return true;
      }

      return (
        child.type === 'container' &&
        'role' in child &&
        child.role === 'page-content'
      );
    });
  });

  // Resolve the background image from the bound image property's
  // placeholder, falling back to the static background image
  const backgroundImage = useElementPlaceholderImage(
    element,
    style.backgroundImage,
  );

  // Resolve background image path if set
  const imagePath = useMediaFilePath(backgroundImage);

  const imageSrc = Fs.useImageSrc(imagePath);

  // The backdrop overlay CSS, null when the root has none
  const backdropCss = createBackdropCss(style);

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

      studio.selectElement('root', layoutId ?? undefined);
    },
    [studio, layoutId],
  );

  // Route drops on the root's gaps into this frame's layout,
  // regardless of which layout is active
  const handleDrop = useCallback(
    (drop: DropEventData, containerId: string, gapIndex: number) => {
      handleDropOnGap(
        studio,
        drop,
        containerId,
        gapIndex,
        layoutId ?? undefined,
      );
    },
    [studio, layoutId],
  );

  const elementCssStyle = useElementCssStyle(element);

  // The wrapper paints the root's surface colour so the background
  // image can layer over it; left on the container, the always
  // emitted colour would cover the wrapper's image instead. The
  // border moves with them: on the container it would sit over the
  // wrapper's image, whose clipped edge aliases past the border's
  // arc on rounded corners.
  const {
    backgroundColor,
    border,
    borderTop,
    borderRight,
    borderBottom,
    borderLeft,
    ...containerBaseCssStyle
  } = elementCssStyle;

  // The wrapper owns the backgrounds, the border and the overlay
  // anchor. Clipping the backgrounds to the padding box keeps the
  // image inside the border's inner edge.
  const wrapperStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor,
    border,
    borderTop,
    borderRight,
    borderBottom,
    borderLeft,
    backgroundClip: 'padding-box',
    ...(imageSrc &&
      createStudioBackgroundImageCss(imageSrc, style.backgroundImageFit)),
    ...(backdropCss && { position: 'relative', isolation: 'isolate' }),
  };

  // Hold an empty layout open so it stays a visible drop target.
  // Card and list frames size to their content, so a root with no
  // elements would otherwise collapse to nothing. A root given a
  // height of its own is already held open by it.
  const needsPlaceholderHeight =
    isEmpty &&
    elementCssStyle.minHeight === undefined &&
    elementCssStyle.height === undefined;

  const containerCssStyle: CSSProperties = {
    ...containerBaseCssStyle,
    ...(needsPlaceholderHeight && { minHeight: EmptyElementMinSize }),
  };

  // Apply the studio's preview scheme to the card. Neutral
  // treatments pin to the neutral roles, so only accent treatments
  // take the hue.
  const wrapperClassName = `designs-studio-root-wrapper${
    previewScheme ? ` scheme-${previewScheme}` : ''
  }`;

  const children = isEmpty ? (
    <EmptyDropHint />
  ) : (
    element.children.map((childId, index) => (
      <DesignStudioElement
        key={childId}
        elementId={childId}
        index={index}
        isLastChild={index === element.children.length - 1}
      />
    ))
  );

  // A panelled root renders a plain flex row with no drop target;
  // an unpanelled root is a drop container for free-form content.
  const rootContainer = panelled ? (
    <div className="designs-studio-root-element" style={containerCssStyle}>
      {children}
    </div>
  ) : (
    <FlexDropContainer
      key={style.direction}
      id="root"
      gap={gapPixels}
      direction={style.direction}
      align={style.align}
      justify={style.justify}
      className="designs-studio-root-element"
      style={containerCssStyle}
      onDrop={handleDrop}
    >
      {children}
    </FlexDropContainer>
  );

  return (
    <ParentDirectionProvider value={style.direction ?? 'column'}>
      <div
        onClick={handleClick}
        data-element-id="root"
        className={wrapperClassName}
        style={wrapperStyle}
      >
        {backdropCss && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: -1,
              pointerEvents: 'none',
              ...backdropCss,
            }}
          />
        )}
        {rootContainer}
      </div>
    </ParentDirectionProvider>
  );
};
