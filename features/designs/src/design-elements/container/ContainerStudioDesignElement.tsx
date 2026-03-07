import { CSSProperties, useMemo } from 'react';
import {
  createBackdropGradientOverlayStyle,
  createContainerCssStyle,
  getPlaceholderMediaDirPath,
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

  // Whether any backdrop effects are active (blur or brightness)
  const hasBackdropEffects =
    style.backdropBlur > 0 || style.backdropBrightness !== 100;

  // Whether to use a nested div (bg image on outer, effects on inner)
  const hasBackdropWithImage = hasBackdropEffects && !!imageSrc;

  // Gradient overlay style (null when gradient is not active)
  const gradientOverlayStyle = createBackdropGradientOverlayStyle(style);

  // Use the full container style (sizing is no longer split onto
  // a wrapper since the wrapper has been removed)
  const baseContainerStyle = createContainerCssStyle(style);

  const containerCssStyle = {
    ...baseContainerStyle,
    // Apply background image URL (only when backdrop effects are not active).
    // When a background color is also set, layer it as a gradient on top
    // of the image so it overlays rather than sitting behind it.
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

  const flexDropContainer = (
    <FlexDropContainer
      {...rootPropsWithoutStyle}
      key={style.direction}
      id={element.id}
      gap={style.gap}
      direction={style.direction}
      align={style.alignItems}
      justify={style.justifyContent}
      style={{ ...containerCssStyle, ...rootStyle }}
      onDrop={handleDropOnGap}
    >
      {children}
    </FlexDropContainer>
  );

  // When backdrop effects + bg image are both active, wrap in an outer
  // div with the background image so backdrop-filter affects the image
  if (hasBackdropWithImage) {
    return (
      <div
        {...rootPropsWithoutStyle}
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: containerCssStyle.backgroundSize,
          backgroundPosition: containerCssStyle.backgroundPosition,
          backgroundRepeat: containerCssStyle.backgroundRepeat,
          borderRadius: containerCssStyle.borderRadius,
          overflow: 'hidden',
          alignSelf: containerCssStyle.alignSelf,
          // Create stacking context for gradient overlay
          ...(gradientOverlayStyle && {
            position: 'relative' as const,
            isolation: 'isolate' as const,
          }),
          ...rootStyle,
        }}
      >
        {gradientOverlayStyle && <div style={gradientOverlayStyle} />}
        <FlexDropContainer
          key={style.direction}
          id={element.id}
          gap={style.gap}
          direction={style.direction}
          align={style.alignItems}
          justify={style.justifyContent}
          style={containerCssStyle}
          onDrop={handleDropOnGap}
        >
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
        <FlexDropContainer
          key={style.direction}
          id={element.id}
          gap={style.gap}
          direction={style.direction}
          align={style.alignItems}
          justify={style.justifyContent}
          style={containerCssStyle}
          onDrop={handleDropOnGap}
        >
          {children}
        </FlexDropContainer>
      </div>
    );
  }

  return flexDropContainer;
};

/**
 * Returns background-image CSS that layers a color overlay on top
 * of a background image when both are present. When only an image
 * is set (no meaningful color), returns just the image. When no
 * image is set, returns nothing so background-color applies normally.
 */
function getBackgroundImageStyle(
  imageSrc: string | null,
  backgroundColor: CSSProperties['backgroundColor'],
): CSSProperties {
  if (!imageSrc) {
    return {};
  }

  // When a non-transparent background color is set, layer it as a
  // solid gradient on top of the image
  if (backgroundColor && backgroundColor !== 'transparent') {
    return {
      backgroundImage: `linear-gradient(${backgroundColor}, ${backgroundColor}), url(${imageSrc})`,
      backgroundColor: 'transparent',
    };
  }

  return { backgroundImage: `url(${imageSrc})` };
}
