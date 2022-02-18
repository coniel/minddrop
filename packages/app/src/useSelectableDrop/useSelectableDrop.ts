import React from 'react';
import { useAppCore } from '../utils';
import { selectDrops } from '../selectDrops';
import { useSelectedDrops } from '../useSelectedDrops';
import { unselectDrops } from '../unselectDrops';
import { clearSelectedDrops } from '../clearSelectedDrops';

export interface DropSelection {
  /**
   * Indicates whether the drop is currently selected.
   */
  isSelected: boolean;

  /**
   * Selects the drop.
   */
  select(): void;

  /**
   * Unselects the drop.
   */
  unselect(): void;

  /**
   * onClick callback for handling selection.
   * - selects the drop if not currently selected
   * - toggles selection if Shift modifier is active
   */
  onClick(event: React.MouseEvent): void;

  /**
   * Applies styling to the drop when it is selected.
   * Should be applied to the container div.
   */
  selectedClass: string;
}

/**
 * Provides drop selection utilities.
 *
 * @param dropId The ID of the drop.
 * @returns Drop selection utilities.
 */
export function useSelectableDrop(dropId: string): DropSelection {
  const core = useAppCore();
  const selectedDrops = useSelectedDrops();
  const isSelected = !!selectedDrops[dropId];

  function handleClick(event: React.MouseEvent) {
    // Stop propagation to prevent document click listener
    // which clears drop selection.
    event.stopPropagation();

    // If not a shift click, unselect all drops and
    // select this one.
    if (!event.shiftKey) {
      clearSelectedDrops(core);
      selectDrops(core, [dropId]);
    } else if (!isSelected) {
      // Shift clicked drop which is not selcted,
      // select the drop.
      selectDrops(core, [dropId]);
    } else {
      // Shift clicked drop which is selcted,
      // unselect the drop.
      unselectDrops(core, [dropId]);
    }
  }

  return {
    isSelected,
    select: () => selectDrops(core, [dropId]),
    unselect: () => unselectDrops(core, [dropId]),
    onClick: handleClick,
    selectedClass: isSelected ? 'drop-selected' : '',
  };
}
