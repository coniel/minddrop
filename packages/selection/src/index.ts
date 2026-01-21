import * as SelectionApi from './Selection';
import { useDraggable } from './useDraggable';
import { useSelectable } from './useSelectable';
import { useSelection } from './useSelection';

export * from './types';
export * from './useDraggable';
export * from './useDroppable';
export * from './useSelectable';
export * from './useSelectionItem';
export * from './useSelection';

export * as SELECTION_TEST_DATA from './test-utils/selection.data';

export const Selection = {
  ...SelectionApi,
  useDraggable,
  useSelectable,
  useSelection,
};
