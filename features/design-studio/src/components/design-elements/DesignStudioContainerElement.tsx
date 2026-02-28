import { BoxIcon } from 'lucide-react';
import { createContainerCssStyle } from '@minddrop/designs';
import { FlexDropContainer } from '@minddrop/feature-drag-and-drop';
import { useTranslation } from '@minddrop/i18n';
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
          <BoxIcon
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
