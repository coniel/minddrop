import { useMemo } from 'react';
import {
  createContainerCssStyle,
  getPlaceholderMediaDirPath,
} from '@minddrop/designs';
import { FlexDropContainer } from '@minddrop/feature-drag-and-drop';
import { Fs } from '@minddrop/file-system';
import { useTranslation } from '@minddrop/i18n';
import { Icon } from '@minddrop/ui-primitives';
import { handleDropOnGap } from '../../handleDropOnGap';
import { FlatContainerDesignElement } from '../../types';
import { DesignStudioElement } from './DesignStudioElement/DesignStudioElement';

export interface DesignStudioContainerElementProps {
  element: FlatContainerDesignElement;
}

export const DesignStudioContainerElement: React.FC<
  DesignStudioContainerElementProps
> = ({ element }) => {
  const { t } = useTranslation();
  const { style } = element;
  const isEmpty = element.children.length === 0;

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

  const containerCssStyle = {
    ...createContainerCssStyle(style),
    // Apply background image URL (only when backdrop effects are not active)
    ...(imageSrc &&
      !hasBackdropWithImage && { backgroundImage: `url(${imageSrc})` }),
    // Ensure the container has a visible size when empty
    ...(isEmpty && {
      minHeight: 80,
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
        gap={style.gap}
        isLastChild={index === element.children.length - 1}
      />
    ))
  );

  // When backdrop effects + bg image are both active, wrap in an outer
  // div with the background image so backdrop-filter affects the image
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
          alignSelf: containerCssStyle.alignSelf,
        }}
      >
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

  return (
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
  );
};
