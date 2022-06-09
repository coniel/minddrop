import { RTBlockElementConfig } from '@minddrop/rich-text';
import { ToDoElementData } from './ToDoElement.types';
import { ToDoElementComponent } from './ToDoElementComponent';

export const ToDoElementConfig: RTBlockElementConfig<ToDoElementData> = {
  type: 'to-do',
  level: 'block',
  dataSchema: {
    done: {
      type: 'boolean',
      required: true,
    },
  },
  component: ToDoElementComponent,
  shortcuts: ['[]'],
  initializeData: () => ({ done: false }),
};
