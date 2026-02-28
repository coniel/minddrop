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
  const direction = useElementStyle(elementId, 'direction');

  const isRow = direction === 'row';

  const handleClick = useCallback(
    (align: ContainerAlign, justify: ContainerJustify) => {
      updateElementStyle(elementId, 'alignItems', align);
      updateElementStyle(elementId, 'justifyContent', justify);
    },
    [elementId],
  );

  // In column mode: rows = justifyContent (vertical), columns = alignItems (horizontal)
  // In row mode: rows = alignItems (vertical), columns = justifyContent (horizontal)
  const rowValues = isRow ? alignValues : justifyValues;
  const columnValues = isRow ? justifyValues : alignValues;

  return (
    <div>
      <div
        className="position-grid"
        role="group"
        aria-label={t('designs.position.label')}
      >
        {rowValues.map((rowValue) =>
          columnValues.map((columnValue) => {
            // Map grid position back to align/justify values
            const align = isRow ? rowValue : columnValue;
            const justify = isRow ? columnValue : rowValue;

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
