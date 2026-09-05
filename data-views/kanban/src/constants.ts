import { DatabaseEntriesDataKey } from '@minddrop/ui-databases';
import {
  KanbanColumnBackground,
  KanbanColumnWidth,
  KanbanViewData,
  KanbanViewOptions,
} from './types';

// Column key holding entries without a group property value
export const NO_VALUE_COLUMN = '';

// The column settings every board falls back to
export const defaultKanbanViewOptions: Required<
  Pick<KanbanViewOptions, 'columnWidth' | 'columnBackground' | 'columnScroll'>
> = {
  columnWidth: 'fill',
  columnBackground: 'none',
  columnScroll: false,
};

export const defaultKanbanViewData: KanbanViewData = {
  order: {},
};

// The widths the columns can take, in the order they are offered
export const KANBAN_COLUMN_WIDTHS: KanbanColumnWidth[] = [
  'fill',
  'narrow',
  'regular',
  'wide',
];

// The backgrounds the columns can be drawn on, in the order they
// are offered
export const KANBAN_COLUMN_BACKGROUNDS: KanbanColumnBackground[] = [
  'none',
  'neutral',
  'accent',
];

// Data types the kanban's drop zones accept
export const KANBAN_ACCEPTED_DATA_TYPES = [DatabaseEntriesDataKey];
