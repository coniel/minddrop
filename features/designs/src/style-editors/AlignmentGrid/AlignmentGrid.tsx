import { useCallback } from 'react';
import {
  ContainerAlign,
  ContainerDirection,
  ContainerJustify,
} from '@minddrop/designs';
import { createI18nKeyBuilder, useTranslation } from '@minddrop/i18n';
import { InputLabel, Stack } from '@minddrop/ui-primitives';
import { fieldLabelKey } from '../styleI18nKeys';
import { StyleEditor } from '../useStyleEditor';
import './AlignmentGrid.css';

/**
 * A position a lane of the grid stands for.
 */
type GridPosition = ContainerAlign;

// The positions children take along the axis they stack in
const MainAxisPositions: GridPosition[] = ['start', 'center', 'end'];

// The positions they take across it, ending with the one which
// fills the container rather than sitting anywhere in it
const CrossAxisPositions: GridPosition[] = [
  'start',
  'center',
  'end',
  'stretch',
];

const verticalPositionKey = createI18nKeyBuilder(
  'designsStudio.style.alignment.vertical.',
);
const horizontalPositionKey = createI18nKeyBuilder(
  'designsStudio.style.alignment.horizontal.',
);

export interface AlignmentGridProps {
  /**
   * The style editing helpers for the element being styled.
   */
  editor: StyleEditor;
}

/**
 * Renders the container's alignment as a grid of positions,
 * oriented to the direction its children stack in: three positions
 * along the axis they stack in, and four across it, the last of
 * which stretches them to fill the container. Pressing the active
 * position clears the alignment.
 *
 * Spread apart children take their own positions along the main
 * axis, so the grid then places them on the cross axis alone and
 * highlights the whole line they sit on.
 */
export const AlignmentGrid: React.FC<AlignmentGridProps> = ({ editor }) => {
  const { t } = useTranslation();
  const { isEditable, getValue, setValue } = editor;

  const align = getValue<ContainerAlign>('align');
  const justify = getValue<ContainerJustify>('justify');
  const direction = getValue<ContainerDirection>('direction');

  // Children stack in a column unless the container says otherwise,
  // where the cross axis runs down the grid rather than across it
  const isRow = direction === 'row';

  const rowPositions = isRow ? CrossAxisPositions : MainAxisPositions;
  const columnPositions = isRow ? MainAxisPositions : CrossAxisPositions;

  // The main axis is out of the grid's hands when the children are
  // spread apart, or when the element's role fixes their spacing
  const crossAxisOnly = justify === 'space-between' || !isEditable('justify');

  // Children pile up at the start of the main axis while it is
  // unset, which is the position the grid shows them in
  const mainAxisPosition = justify ?? 'start';

  const handleSelect = useCallback(
    (
      cellAlign: ContainerAlign,
      cellJustify: ContainerJustify,
      isActive: boolean,
    ) => {
      // Pressing the active position clears it, matching how the
      // other fields are cleared back to inherit
      setValue('align', isActive ? undefined : cellAlign);

      // The main axis position is only the grid's to set while it
      // holds both axes
      if (!crossAxisOnly) {
        setValue('justify', isActive ? undefined : cellJustify);
      }
    },
    [setValue, crossAxisOnly],
  );

  return (
    <Stack gap={1}>
      <InputLabel size="xs" label={fieldLabelKey('align')} />
      <div
        className="designs-alignment-grid"
        role="group"
        data-direction={isRow ? 'row' : 'column'}
        aria-label={t(fieldLabelKey('align'))}
      >
        {rowPositions.map((rowPosition) =>
          columnPositions.map((columnPosition) => {
            // A row container aligns its children down the grid and
            // distributes them across it, a column container the
            // other way round
            const cellAlign = isRow ? rowPosition : columnPosition;
            const cellJustify = resolveJustify(
              isRow ? columnPosition : rowPosition,
            );

            // Nothing is active until the cross axis is set, so an
            // inherited alignment shows as no selection
            const isActive = crossAxisOnly
              ? align === cellAlign
              : align === cellAlign && mainAxisPosition === cellJustify;

            return (
              <button
                key={`${rowPosition}-${columnPosition}`}
                type="button"
                className="designs-alignment-grid-cell"
                aria-label={t('designsStudio.style.alignment.cell', {
                  vertical: t(verticalPositionKey(rowPosition)),
                  horizontal: t(horizontalPositionKey(columnPosition)),
                })}
                aria-pressed={isActive}
                data-active={isActive}
                onClick={() => handleSelect(cellAlign, cellJustify, isActive)}
              >
                {/** Stretched children fill the container rather
                 * than sitting at a point in it, so their cells
                 * draw a bar in place of the dot **/}
                <span
                  className={
                    cellAlign === 'stretch'
                      ? 'designs-alignment-grid-bar'
                      : 'designs-alignment-grid-dot'
                  }
                />
              </button>
            );
          }),
        )}
      </div>
    </Stack>
  );
};

/**
 * Narrows a grid position to the ones the main axis offers, which
 * never include the stretch the cross axis adds.
 */
function resolveJustify(position: GridPosition): ContainerJustify {
  return position === 'stretch' ? 'start' : position;
}
