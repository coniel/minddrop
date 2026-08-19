import { CSSProperties, useCallback } from 'react';
import {
  ContainerStyle,
  createBackdropCss,
  resolveElementStyle,
} from '@minddrop/designs';
import { Fs } from '@minddrop/file-system';
import { DropEventData } from '@minddrop/selection';
import { FlexDropContainer } from '@minddrop/ui-drag-and-drop';
import { DesignStudioElement } from '../../DesignStudioElement';
import { useDesignStudio, useElement } from '../../DesignStudioStore';
import { EmptyDropHint } from '../../EmptyDropHint';
import { useLayoutId } from '../../LayoutIdContext';
import { useLayoutType } from '../../LayoutTypeContext';
import { ParentDirectionProvider } from '../../ParentDirectionContext';
import { EmptyElementMinSize } from '../../constants';
import { handleDropOnGap } from '../../handleDropOnGap';
import {
  FlatContainerDesignElement,
  FlatPagePanelDesignElement,
  FlatRootDesignElement,
} from '../../types';
import { useElementCssStyle } from '../../useElementCssStyle';
import { useElementPlaceholderImage } from '../../useElementPlaceholder';
import { useMediaFilePath } from '../../useMediaFilePath';
import { useSpaceTokenPixels } from '../../useSpaceTokenPixels';
import { resolveRegionFlexStyle } from '../../utils';
import { createStudioBackgroundImageCss } from './studioContainerCss';

export interface ContainerStudioDesignElementProps {
  /**
   * The container element to render in the studio. Page panels
   * reuse this renderer since they are structurally containers.
   */
  element: FlatContainerDesignElement | FlatPagePanelDesignElement;

  /**
   * Props to spread on the outermost DOM element for
   * drag-and-drop and click-to-select behaviour.
   */
  rootProps: Record<string, unknown>;

  /**
   * CSS applied over the element's resolved CSS (e.g. a page
   * panel's live resize width).
   */
  styleOverrides?: CSSProperties;
}

/**
 * Renders a container element in the design studio.
 * Wraps children in a flex drop container for drag-and-drop
 * reordering, with support for background images and
 * backdrop effects.
 */
export const ContainerStudioDesignElement: React.FC<
  ContainerStudioDesignElementProps
> = ({ element, rootProps, styleOverrides }) => {
  const studio = useDesignStudio();
  const layoutId = useLayoutId();
  // The surrounding layout's type, which role styles resolve against
  const layoutType = useLayoutType();
  // Resolve the element's style with its role styles applied
  const style: ContainerStyle = resolveElementStyle(
    element,
    layoutType ?? undefined,
  );
  const isEmpty = element.children.length === 0;
  const gapPixels = useSpaceTokenPixels(style.gap);
  // The root's content width cap, which the content region applies
  const root = useElement<FlatRootDesignElement>('root');

  // Separate style from rootProps so it can be merged with
  // container styles rather than clobbering them
  const { style: rootStyle, ...rootPropsWithoutStyle } = rootProps as {
    style?: CSSProperties;
    [key: string]: unknown;
  };

  // Resolve the background image from the bound image property's
  // placeholder, falling back to the static background image
  const backgroundImage = useElementPlaceholderImage(
    element,
    style.backgroundImage,
  );

  // Resolve background image path if set
  const imagePath = useMediaFilePath(backgroundImage);

  const imageSrc = Fs.useImageSrc(imagePath);

  // The backdrop overlay CSS, null when the container has none
  const backdropCss = createBackdropCss(style);

  const elementCssStyle = useElementCssStyle(element);

  // The direction this container stacks its children in, which is
  // what decides the axis a child filling its height fills
  const childDirection = style.direction ?? 'column';

  // Give an empty container a visible size, leaving whichever axis
  // its own style already sizes alone. The placeholder surface
  // itself comes from the drop hint filling the container
  const emptyPlaceholderCss: CSSProperties = {
    ...(elementCssStyle.minHeight === undefined &&
      elementCssStyle.height === undefined && {
        minHeight: EmptyElementMinSize,
      }),
    ...(elementCssStyle.width === undefined && {
      minWidth: EmptyElementMinSize,
    }),
  };

  const containerCssStyle: CSSProperties = {
    ...elementCssStyle,
    ...(isEmpty && emptyPlaceholderCss),
    // Panelled page root regions: panels stay fixed-width, content grows
    ...resolveRegionFlexStyle(
      element,
      root?.style.maxWidth,
      root?.style.contentPadding,
    ),
    ...styleOverrides,
  };

  // The background image CSS, applied to the container itself, or
  // to the backdrop wrapper when a backdrop effect is active
  const backgroundImageCss = imageSrc
    ? createStudioBackgroundImageCss(imageSrc, style.backgroundImageFit)
    : undefined;

  // Route drops on the container's gaps into this frame's layout,
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

  // Shared FlexDropContainer props used in both render paths. The
  // direction key remounts the container when the axis flips, so
  // its drop gaps are measured against the new layout direction.
  const flexDropProps = {
    id: element.id,
    gap: gapPixels,
    direction: style.direction,
    align: style.align,
    justify: style.justify,
    onDrop: handleDrop,
  } as const;

  // Backdrop active: the background image goes on an outer wrapper
  // with the blur overlay layered between it and the content, so
  // the overlay frosts the image but not the children
  if (backdropCss) {
    return (
      <ParentDirectionProvider value={childDirection}>
        <div
          {...rootPropsWithoutStyle}
          style={{
            ...backgroundImageCss,
            position: 'relative',
            isolation: 'isolate',
            alignSelf: containerCssStyle.alignSelf,
            ...styleOverrides,
            ...rootStyle,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              pointerEvents: 'none',
              ...backdropCss,
            }}
          />
          <FlexDropContainer
            key={style.direction}
            {...flexDropProps}
            style={{ ...containerCssStyle, position: 'relative', zIndex: 1 }}
          >
            {children}
          </FlexDropContainer>
        </div>
      </ParentDirectionProvider>
    );
  }

  // Default: no wrapping needed, rootProps go on the FlexDropContainer
  return (
    <ParentDirectionProvider value={childDirection}>
      <FlexDropContainer
        key={style.direction}
        {...rootPropsWithoutStyle}
        {...flexDropProps}
        style={{ ...containerCssStyle, ...backgroundImageCss, ...rootStyle }}
      >
        {children}
      </FlexDropContainer>
    </ParentDirectionProvider>
  );
};
