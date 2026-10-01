import { createDomRect } from '@minddrop/test-utils';
import { ActiveDrag, DropEventData } from '../types';

export const activeDrag_1: ActiveDrag = {
  id: 'active-drag_1',
  type: 'item',
  types: ['items', 'text/plain'],
  data: { items: ['active-drag_1'], 'text/plain': 'Item 1' },
  origin: { type: 'list', id: 'list_1' },
  effect: 'move',
  sourceRect: createDomRect(0, 0, 100, 40),
  token: 'token_1',
};

export const dropEventData_1: DropEventData = {
  targetType: 'list',
  targetId: 'list_1',
  position: 'inside',
  data: { 'text/plain': 'Item 1' },
  origin: { type: 'list', id: 'list_1' },
  clientX: 0,
  clientY: 0,
};
