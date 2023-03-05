import { SelectionApi } from './types';
import { getSelection } from './getSelection';
import { getSelectionPaths } from './getSelectionPaths';
import { getFromDataInsert } from './getFromDataInsert';
import { isSelected } from './isSelected';
import { selectionContains } from './selectionContains';
import { selectionIsEmpty } from './selectionIsEmpty';
import { filterSelectionItems } from './filterSelectionItems';
import { addToSelection } from './addToSelection';
import { removeFromSelection } from './removeFromSelection';
import { select } from './select';
import { clearSelection } from './clearSelection';
import { dragStart } from './dragStart';
import { dragEnd } from './dragEnd';
import { copySelection } from './copySelection';
import { cutSelection } from './cutSelection';

export const Selection: SelectionApi = {
  get: getSelection,
  getPaths: getSelectionPaths,
  getFromDataInsert,
  isSelected,
  contains: selectionContains,
  isEmpty: selectionIsEmpty,
  filter: filterSelectionItems,
  add: addToSelection,
  remove: removeFromSelection,
  select,
  clear: clearSelection,
  dragStart,
  dragEnd,
  copy: copySelection,
  cut: cutSelection,
};
