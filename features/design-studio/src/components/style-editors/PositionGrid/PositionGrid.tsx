import { useCallback } from 'react';
import { ContainerAlign, ContainerJustify } from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
import {
  updateElementStyle,
  useElementStyle,
} from '../../../DesignStudioStore';
import './PositionGrid.css';

export interface PositionGridProps {
  elementId: string;
}

const alignValues: ContainerAlign[] = ['start', 'center', 'end'];
const justifyValues: ContainerJustify[] = ['start', 'center', 'end'];

export const PositionGrid = ({ elementId }: PositionGridProps) => {
  const { t } = useTranslation();
  const alignItems = useElementStyle(elementId, 'alignItems');
  const justifyContent = useElementStyle(elementId, 'justifyContent');

  const handleClick = useCallback(
    (align: ContainerAlign, justify: ContainerJustify) => {
      updateElementStyle(elementId, 'alignItems', align);
      updateElementStyle(elementId, 'justifyContent', justify);
    },
    [elementId],
  );

  return (
    <div>
      <div
        className="position-grid"
        role="group"
        aria-label={t('designs.position.label')}
      >
        {justifyValues.map((justify) =>
          alignValues.map((align) => {
          const isActive =
            alignItems === align && justifyContent === justify;

          return (
            <button
              key={`${justify}-${align}`}
              type="button"
              className={`position-grid-cell${isActive ? ' position-grid-cell-active' : ''}`}
              aria-label={t('designs.position.cell', {
                horizontal: align,
                vertical: justify,
              })}
              aria-pressed={isActive}
              onClick={() => handleClick(align, justify)}
            >
              <span className="position-grid-dot" />
            </button>
          );
        }),
      )}
      </div>
    </div>
  );
};
