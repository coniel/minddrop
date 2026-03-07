import { CSSProperties, useMemo } from 'react';
import {
  createBackdropImageWrapperStyle,
  createContainerCssStyle,
  getBackgroundImageStyle,
  getPlaceholderMediaDirPath,
  resolveContainerBackdrop,
} from '@minddrop/designs';
import { Fs } from '@minddrop/file-system';
import { useTranslation } from '@minddrop/i18n';
import { FlexDropContainer } from '@minddrop/ui-drag-and-drop';
import { Icon } from '@minddrop/ui-primitives';
import { DesignStudioElement } from '../../DesignStudioElement/DesignStudioElement';
import { handleDropOnGap } from '../../handleDropOnGap';
import { FlatContainerDesignElement } from '../../types';

export interface ContainerStudioDesignElementProps {
  /**
   * The container element to render in the studio.
   */
  element: FlatContainerDesignElement;

  /**
   * Props to spread on the outermost DOM element for
   * drag-and-drop and click-to-select behaviour.
   */
  rootProps: Record<string, unknown>;
}

/**
 * Renders a container element in the design studio.
 * Wraps children in a flex drop container for drag-and-drop
 * reordering, with support for background images and
 * backdrop effects.
 */
export const ContainerStudioDesignElement: React.FC<
  ContainerStudioDesignElementProps
> = ({ element, rootProps }) => {
  const { t } = useTranslation();
  const { style } = element;
  const isEmpty = element.children.length === 0;

  // Separate style from rootProps so it can be merged with
  // container styles rather than clobbering them
  const { style: rootStyle, ...rootPropsWithoutStyle } = rootProps as {
    style?: CSSProperties;
    [key: string]: unknown;
  };

  // Resolve background image path if set
  const imagePath = useMemo(
    () =>
      style.backgroundImage
        ? Fs.concatPath(getPlaceholderMediaDirPath(), style.backgroundImage)
        : null,
    [style.backgroundImage],
  );

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
    // Ensure the container has a visible size when empty
    ...(isEmpty && {
      minHeight: 80,
      minWidth: 80,
      backgroundColor: 'var(--neutral-400)',
    }),
  };

  const children = isEmpty ? (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        width: '100%',
        height: '100%',
        minHeight: 80,
      }}
    >
      <Icon
        name="box"
        size={24}
        style={{ color: 'var(--contrast-500)', flexShrink: 0 }}
      />
      <span
        style={{
          color: 'var(--contrast-500)',
          fontSize: 'var(--text-xs)',
          textAlign: 'center',
        }}
      >
        {t('design-studio.elements.container-empty-hint')}
      </span>
    </div>
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

  // Shared FlexDropContainer props used in all three render paths
  const flexDropProps = {
    key: style.direction,
    id: element.id,
    gap: style.gap,
    direction: style.direction,
    align: style.alignItems,
    justify: style.justifyContent,
    onDrop: handleDropOnGap,
  } as const;

  // When backdrop effects + bg image are both active, wrap in an outer
  // div with the background image so backdrop-filter affects the image.
  // rootProps go on the outer wrapper since it is the outermost element.
  if (hasBackdropWithImage) {
    return (
      <div
        {...rootPropsWithoutStyle}
        style={{
          ...createBackdropImageWrapperStyle(
            imageSrc!,
            containerCssStyle,
            gradientOverlayStyle,
          ),
          alignSelf: containerCssStyle.alignSelf,
          ...rootStyle,
        }}
      >
        {gradientOverlayStyle && <div style={gradientOverlayStyle} />}
        <FlexDropContainer {...flexDropProps} style={containerCssStyle}>
          {children}
        </FlexDropContainer>
      </div>
    );
  }

  // When gradient is active without a bg image, wrap in a
  // relative container for the absolutely positioned overlay
  if (gradientOverlayStyle) {
    return (
      <div
        {...rootPropsWithoutStyle}
        style={{
          position: 'relative',
          isolation: 'isolate',
          alignSelf: containerCssStyle.alignSelf,
          ...rootStyle,
        }}
      >
        <div style={gradientOverlayStyle} />
        <FlexDropContainer {...flexDropProps} style={containerCssStyle}>
          {children}
        </FlexDropContainer>
      </div>
    );
  }

  // Default: no wrapping needed, rootProps go on the FlexDropContainer
  return (
    <FlexDropContainer
      {...rootPropsWithoutStyle}
      {...flexDropProps}
      style={{ ...containerCssStyle, ...rootStyle }}
    >
      {children}
    </FlexDropContainer>
  );
};
