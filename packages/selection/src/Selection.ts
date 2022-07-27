import { SelectionApi } from './types';
import { getSelection } from './getSelection';
import { getSelectionIds } from './getSelectionIds';
import { getFromDataInsert } from './getFromDataInsert';
import { isSelected } from './isSelected';
import { filterSelectionItems } from './filterSelectionItems';
import { item } from './item';
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
  getIds: getSelectionIds,
  getFromDataInsert,
  isSelected,
  filter: filterSelectionItems,
  item,
  add: addToSelection,
  remove: removeFromSelection,
  select,
  clear: clearSelection,
  dragStart,
  dragEnd,
  copy: copySelection,
  cut: cutSelection,
};
