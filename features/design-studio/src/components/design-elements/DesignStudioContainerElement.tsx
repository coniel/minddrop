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

  return (
    <FlexDropContainer
      key={style.direction}
      id={element.id}
      gap={style.gap}
      direction={style.direction}
      align={style.alignItems}
      justify={style.justifyContent}
      style={{
        ...createContainerCssStyle(style),
        // Apply background image URL resolved from the file system
        ...(imageSrc && { backgroundImage: `url(${imageSrc})` }),
        // Ensure the container has a visible size when empty
        ...(isEmpty && {
          minHeight: 80,
          backgroundColor: 'var(--neutral-400)',
        }),
      }}
      onDrop={handleDropOnGap}
    >
      {isEmpty ? (
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
      )}
    </FlexDropContainer>
  );
};
