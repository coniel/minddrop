import { RTBlockElementConfig } from '@minddrop/rich-text';
import { ToDoElementComponent } from './ToDoElementComponent';

export const ToDoElementConfig: RTBlockElementConfig = {
  type: 'to-do',
  level: 'block',
  component: ToDoElementComponent,
  shortcuts: ['[]'],
  initializeData: () => ({ done: false }),
};
